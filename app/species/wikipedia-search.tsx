"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { ExternalLink, Loader2, Search } from "lucide-react";
import { useState } from "react";

interface WikipediaSearchResult {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
  };
  content_urls?: {
    desktop?: {
      page: string;
    };
  };
}

export default function WikipediaSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<WikipediaSearchResult | null>(null);

  const actualWikiSearching = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Empty search",
        description: "Please enter a species name to search.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSearchResult(null);

    try {
      // Making a request to wikipedia to find the page summary
      const searchResponse = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchQuery.trim())}`,
      );

      if (!searchResponse.ok) {
        throw new Error("Article not found");
      }

      const data: WikipediaSearchResult = await searchResponse.json();

      if (!data.extract) {
        toast({
          title: "No information found",
          description: `No description found for "${searchQuery}" on Wikipedia.`,
          variant: "destructive",
        });
        return;
      }

      setSearchResult(data);

      toast({
        title: "Information found!",
        description: `Successfully retrieved information for "${data.title}" from Wikipedia.`,
      });
    } catch (error) {
      console.error("Wikipedia search error:", error);
      toast({
        title: "Search failed",
        description: `No Wikipedia article found for "${searchQuery}". Please try a different search term.`,
        variant: "destructive",
      });
      setSearchResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await actualWikiSearching();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Section */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Wikipedia Species Search</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Search Wikipedia for species information to learn more before adding to your collection
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter species name (scientific or common name)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                handleKeyPress(e).catch(console.error);
              }}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => {
                actualWikiSearching().catch(console.error);
              }}
              disabled={isLoading || !searchQuery.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {searchResult && (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-semibold leading-none tracking-tight">{searchResult.title}</h3>
                {searchResult.content_urls?.desktop?.page && (
                  <div className="mt-2 flex items-center space-x-1">
                    <ExternalLink className="h-3 w-3" />
                    <a
                      href={searchResult.content_urls.desktop.page}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline hover:text-blue-800"
                    >
                      View full Wikipedia article
                    </a>
                  </div>
                )}
              </div>
              {searchResult.thumbnail?.source && (
                <img
                  src={searchResult.thumbnail.source}
                  alt={searchResult.title}
                  className="ml-4 h-24 w-24 flex-shrink-0 rounded-lg object-cover"
                />
              )}
            </div>
          </div>
          <div className="p-6 pt-0">
            <p className="text-sm leading-relaxed text-muted-foreground">{searchResult.extract}</p>
          </div>
        </div>
      )}
    </div>
  );
}
