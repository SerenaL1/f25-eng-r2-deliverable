"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import type { Database } from "@/lib/schema";
import { useCallback, useEffect, useState } from "react";

type Species = Database["public"]["Tables"]["species"]["Row"];

// Define the comment type
interface Comment {
  id: number;
  species_id: number;
  author: string;
  content: string;
  created_at: string;
  profiles: {
    display_name: string;
  };
}

export default function SpeciesDetailsDialog({ species, currentUser }: { species: Species; currentUser: string }) {
  const [open, setOpen] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = useCallback(async (): Promise<void> => {
    try {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from("comments")
        .select(
          `
          *,
          profiles:author (
            display_name
          )
        `,
        )
        .eq("species_id", species.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error loading comments",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setComments((data as unknown as Comment[]) || []);
      }
    } catch (error) {
      console.error("Unexpected error fetching comments:", error);
    }
  }, [species.id]);

  // Fetch comments when dialog opens
  useEffect(() => {
    if (open) {
      fetchComments().catch((error) => {
        console.error("Error in fetchComments:", error);
      });
    }
  }, [open, fetchComments]);

  const handleSubmitComment = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const supabase = createBrowserSupabaseClient();

      const { error } = await supabase.from("comments").insert([
        {
          species_id: species.id,
          author: currentUser,
          content: newComment.trim(),
        },
      ]);

      if (error) {
        toast({
          title: "Error posting comment",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setNewComment("");
        await fetchComments();
        toast({
          title: "Comment posted!",
        });
      }
    } catch (error) {
      console.error("Unexpected error posting comment:", error);
      toast({
        title: "Error posting comment",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number): Promise<void> => {
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.from("comments").delete().eq("id", commentId);

      if (error) {
        toast({
          title: "Error deleting comment",
          description: error.message,
          variant: "destructive",
        });
      } else {
        await fetchComments();
        toast({
          title: "Comment deleted",
        });
      }
    } catch (error) {
      console.error("Unexpected error deleting comment:", error);
      toast({
        title: "Error deleting comment",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full">Learn More</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Species Details</DialogTitle>
          <DialogDescription>Detailed information about {species.scientific_name}</DialogDescription>
        </DialogHeader>

        <div className="grid w-full items-center gap-6">
          {/* Species Information */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Scientific Name</h3>
              <p className="text-xl">{species.scientific_name}</p>
            </div>

            {species.common_name && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Common Name</h3>
                <p className="text-xl italic">{species.common_name}</p>
              </div>
            )}

            {species.kingdom && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Kingdom</h3>
                <p className="text-xl">{species.kingdom}</p>
              </div>
            )}

            {species.total_population && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Total Population</h3>
                <p className="text-xl">{species.total_population.toLocaleString()}</p>
              </div>
            )}

            {species.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Description</h3>
                <p className="text-base leading-relaxed">{species.description}</p>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="border-t pt-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">Comments</h3>

            {/* Add Comment Form - currentUser is always string now */}
            <form
              onSubmit={(e) => {
                handleSubmitComment(e).catch(console.error);
              }}
              className="mb-6"
            >
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="mb-3"
                rows={3}
              />
              <Button type="submit" disabled={!newComment.trim() || isSubmitting} size="sm">
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </form>

            {/* Comments List */}
            <div className="max-h-60 space-y-4 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="italic text-gray-500">No comments yet</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="rounded-lg bg-gray-50 p-3">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <span className="text-sm font-medium">{comment.profiles.display_name}</span>
                        <span className="ml-2 text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {currentUser === comment.author && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            handleDeleteComment(comment.id).catch(console.error);
                          }}
                          className="h-auto p-1 text-red-600 hover:text-red-800"
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
