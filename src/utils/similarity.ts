import { Track } from "@/data/tracks";

// Calculate cosine similarity between two tracks based on audio features
export function cosineSimilarity(trackA: Track, trackB: Track): number {
  const featuresA = [
    trackA.energy,
    trackA.valence,
    trackA.danceability,
    trackA.acousticness,
    trackA.instrumentalness,
    (trackA.loudness + 20) / 20, // Normalize loudness to 0-1 range
    trackA.tempo / 200, // Normalize tempo to 0-1 range
  ];

  const featuresB = [
    trackB.energy,
    trackB.valence,
    trackB.danceability,
    trackB.acousticness,
    trackB.instrumentalness,
    (trackB.loudness + 20) / 20,
    trackB.tempo / 200,
  ];

  const dotProduct = featuresA.reduce((sum, a, i) => sum + a * featuresB[i], 0);
  const magnitudeA = Math.sqrt(featuresA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(featuresB.reduce((sum, b) => sum + b * b, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

// Find similar tracks to a given track
export function findSimilarTracks(
  targetTrack: Track,
  allTracks: Track[],
  limit: number = 5
): { track: Track; similarity: number }[] {
  return allTracks
    .filter((track) => track.id !== targetTrack.id)
    .map((track) => ({
      track,
      similarity: cosineSimilarity(targetTrack, track),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

// Synonym mappings for music-related terms
const synonymMappings: Record<string, string[]> = {
  // Mood synonyms
  happy: ["joyful", "cheerful", "upbeat", "bright", "positive", "sunny", "fun", "playful", "uplifting"],
  chill: ["relaxed", "calm", "mellow", "peaceful", "laid-back", "easy", "smooth", "soothing", "tranquil", "zen"],
  focus: ["concentrate", "study", "work", "productive", "deep", "thinking", "concentration", "ambient"],
  dreamy: ["ethereal", "atmospheric", "floating", "spacey", "cosmic", "mystical", "surreal", "fantasy"],
  dark: ["moody", "intense", "brooding", "melancholy", "sad", "gloomy", "noir", "gothic", "mysterious"],
  hype: ["energetic", "exciting", "pumped", "party", "wild", "intense", "powerful", "explosive", "epic", "loud"],
  // Genre synonyms
  electronic: ["synth", "electro", "edm", "dance", "techno", "house", "beats"],
  jazz: ["jazzy", "swing", "bebop", "blues", "saxophone", "brass"],
  ambient: ["atmospheric", "soundscape", "background", "environmental"],
  rock: ["guitar", "band", "alternative", "indie"],
  classical: ["orchestra", "symphony", "piano", "instrumental", "orchestral"],
  "hip hop": ["rap", "hiphop", "trap", "beats", "urban"],
  lofi: ["lo-fi", "chill beats", "study music", "chillhop"],
  metal: ["heavy", "loud", "thrash", "hardcore"],
  pop: ["popular", "mainstream", "catchy"],
  funk: ["funky", "groovy", "groove", "disco"],
  reggae: ["tropical", "island", "caribbean", "jamaican"],
  // Feature-related
  fast: ["quick", "rapid", "uptempo", "speedy", "energetic"],
  slow: ["downtempo", "gentle", "soft", "quiet"],
  loud: ["powerful", "strong", "heavy", "intense"],
  soft: ["quiet", "gentle", "subtle", "delicate"],
  instrumental: ["no vocals", "without vocals", "instrumental only"],
  acoustic: ["unplugged", "natural", "organic"],
};

// Levenshtein distance for approximate string matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

// Calculate fuzzy match score (0-1, higher is better)
function fuzzyMatchScore(query: string, target: string): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  
  // Exact match
  if (t === q) return 1;
  
  // Contains match
  if (t.includes(q)) return 0.9;
  
  // Starts with
  if (t.startsWith(q)) return 0.95;
  
  // Word boundary match
  const words = t.split(/\s+/);
  for (const word of words) {
    if (word.startsWith(q)) return 0.85;
    if (word.includes(q)) return 0.75;
  }
  
  // Levenshtein distance for approximate matching
  const distance = levenshteinDistance(q, t);
  const maxLen = Math.max(q.length, t.length);
  const similarity = 1 - distance / maxLen;
  
  // Only accept if similarity is above threshold
  if (similarity >= 0.6) return similarity * 0.7;
  
  // Check word-level similarity
  for (const word of words) {
    const wordDistance = levenshteinDistance(q, word);
    const wordSimilarity = 1 - wordDistance / Math.max(q.length, word.length);
    if (wordSimilarity >= 0.7) return wordSimilarity * 0.65;
  }
  
  return 0;
}

// Expand query with synonyms
function expandQueryWithSynonyms(query: string): string[] {
  const normalizedQuery = query.toLowerCase().trim();
  const expanded = new Set<string>([normalizedQuery]);
  
  // Check if query matches any synonym and add the main term
  for (const [mainTerm, synonyms] of Object.entries(synonymMappings)) {
    if (mainTerm.includes(normalizedQuery) || normalizedQuery.includes(mainTerm)) {
      expanded.add(mainTerm);
      synonyms.forEach(s => expanded.add(s));
    }
    for (const synonym of synonyms) {
      if (synonym.includes(normalizedQuery) || normalizedQuery.includes(synonym)) {
        expanded.add(mainTerm);
        synonyms.forEach(s => expanded.add(s));
        break;
      }
    }
  }
  
  return Array.from(expanded);
}

// Fuzzy search implementation with synonyms and approximate matching
export function fuzzySearch(query: string, tracks: Track[]): Track[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return tracks;

  // Expand query with synonyms
  const expandedQueries = expandQueryWithSynonyms(normalizedQuery);

  return tracks
    .map((track) => {
      let maxScore = 0;
      
      const searchableFields = [
        { value: track.name, weight: 1.0 },
        { value: track.artist, weight: 0.9 },
        { value: track.genre, weight: 0.8 },
        { value: track.mood, weight: 0.85 },
      ];

      // Check all expanded queries against all fields
      for (const q of expandedQueries) {
        for (const field of searchableFields) {
          const fieldScore = fuzzyMatchScore(q, field.value);
          const weightedScore = fieldScore * field.weight * 100;
          
          // Boost original query matches
          const boost = q === normalizedQuery ? 1 : 0.85;
          maxScore = Math.max(maxScore, weightedScore * boost);
        }
      }

      return { track, score: maxScore };
    })
    .filter((item) => item.score > 30) // Threshold for relevance
    .sort((a, b) => b.score - a.score)
    .map((item) => item.track);
}

// Calculate playlist statistics
export function analyzePlaylist(tracks: Track[]): {
  avgEnergy: number;
  avgValence: number;
  avgDanceability: number;
  avgTempo: number;
  tempoVariance: number;
  moodDistribution: Record<string, number>;
  genreDistribution: Record<string, number>;
  consistencyScore: number;
} {
  if (tracks.length === 0) {
    return {
      avgEnergy: 0,
      avgValence: 0,
      avgDanceability: 0,
      avgTempo: 0,
      tempoVariance: 0,
      moodDistribution: {},
      genreDistribution: {},
      consistencyScore: 0,
    };
  }

  const avgEnergy = tracks.reduce((sum, t) => sum + t.energy, 0) / tracks.length;
  const avgValence = tracks.reduce((sum, t) => sum + t.valence, 0) / tracks.length;
  const avgDanceability = tracks.reduce((sum, t) => sum + t.danceability, 0) / tracks.length;
  const avgTempo = tracks.reduce((sum, t) => sum + t.tempo, 0) / tracks.length;

  // Calculate tempo variance
  const tempoVariance = Math.sqrt(
    tracks.reduce((sum, t) => sum + Math.pow(t.tempo - avgTempo, 2), 0) / tracks.length
  );

  // Mood distribution
  const moodDistribution: Record<string, number> = {};
  tracks.forEach((t) => {
    moodDistribution[t.mood] = (moodDistribution[t.mood] || 0) + 1;
  });

  // Genre distribution
  const genreDistribution: Record<string, number> = {};
  tracks.forEach((t) => {
    genreDistribution[t.genre] = (genreDistribution[t.genre] || 0) + 1;
  });

  // Calculate consistency score (0-100)
  const energyVariance = Math.sqrt(
    tracks.reduce((sum, t) => sum + Math.pow(t.energy - avgEnergy, 2), 0) / tracks.length
  );
  const valenceVariance = Math.sqrt(
    tracks.reduce((sum, t) => sum + Math.pow(t.valence - avgValence, 2), 0) / tracks.length
  );
  const consistencyScore = Math.round(
    (1 - (energyVariance + valenceVariance + tempoVariance / 100) / 3) * 100
  );

  return {
    avgEnergy,
    avgValence,
    avgDanceability,
    avgTempo,
    tempoVariance,
    moodDistribution,
    genreDistribution,
    consistencyScore: Math.max(0, Math.min(100, consistencyScore)),
  };
}
