import { useState, useMemo } from "react";
import { sampleTracks, Track } from "@/data/tracks";
import { fuzzySearch } from "@/utils/similarity";
import { HeroSection } from "@/components/HeroSection";
import { SearchBar } from "@/components/SearchBar";
import { TrackCard } from "@/components/TrackCard";
import { MoodExplorer } from "@/components/MoodExplorer";
import { GenreGalaxy } from "@/components/GenreGalaxy";
import { SimilarTracks } from "@/components/SimilarTracks";
import { Disc3 } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  // Filter tracks based on search and mood
  const filteredTracks = useMemo(() => {
    let results = sampleTracks;

    // Apply mood filter
    if (selectedMood) {
      results = results.filter((track) => track.mood === selectedMood);
    }

    // Apply search filter
    if (searchQuery) {
      results = fuzzySearch(searchQuery, results);
    }

    return results;
  }, [searchQuery, selectedMood]);

  const handleTrackSelect = (track: Track) => {
    setSelectedTrack(track);
    // Scroll to track details on mobile
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        document.getElementById("track-details")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      <main className="container mx-auto px-4 pb-16">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search tracks, artists, moods, genres..."
          />
        </div>

        {/* Mood Explorer */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="gradient-text">Explore by Mood</span>
          </h2>
          <MoodExplorer
            tracks={sampleTracks}
            selectedMood={selectedMood}
            onSelectMood={setSelectedMood}
          />
        </section>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Track List */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tracks Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedMood ? (
                    <span className="gradient-text">
                      {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)} Tracks
                    </span>
                  ) : searchQuery ? (
                    <span className="gradient-text">Search Results</span>
                  ) : (
                    <span className="gradient-text">All Tracks</span>
                  )}
                </h2>
                <span className="text-sm text-muted-foreground font-mono">
                  {filteredTracks.length} tracks
                </span>
              </div>

              {filteredTracks.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredTracks.map((track, index) => (
                    <div
                      key={track.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <TrackCard
                        track={track}
                        onClick={() => handleTrackSelect(track)}
                        isSelected={selectedTrack?.id === track.id}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 glass-card rounded-2xl">
                  <Disc3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No tracks found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try a different search or mood
                  </p>
                </div>
              )}
            </section>

            {/* Genre Galaxy */}
            <section>
              <h2 className="text-2xl font-bold mb-6">
                <span className="gradient-text">Genre Galaxy</span>
              </h2>
              <GenreGalaxy tracks={sampleTracks} onSelectTrack={handleTrackSelect} />
            </section>
          </div>

          {/* Sidebar - Track Details & Similar */}
          <div className="space-y-6" id="track-details">
            {selectedTrack ? (
              <>
                {/* Selected Track Details */}
                <div className="sticky top-4">
                  <h2 className="text-xl font-bold mb-4 gradient-text">Now Playing</h2>
                  <TrackCard
                    track={selectedTrack}
                    isSelected
                    showFeatures
                  />
                  
                  {/* Similar Tracks */}
                  <div className="mt-6">
                    <SimilarTracks
                      track={selectedTrack}
                      allTracks={sampleTracks}
                      onSelectTrack={handleTrackSelect}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="glass-card p-8 rounded-2xl text-center">
                <Disc3 className="w-16 h-16 mx-auto text-muted-foreground mb-4 animate-vinyl-spin" />
                <h3 className="font-semibold text-lg mb-2">Select a Track</h3>
                <p className="text-sm text-muted-foreground">
                  Click on any track to see its audio features and discover similar music
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Built with{" "}
            <span className="text-primary">♪</span> for music lovers •{" "}
            <span className="font-mono">Demo Version</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
