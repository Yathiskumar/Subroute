"use client";

import * as React from "react";
import { TopicCard } from "@/components/cards/TopicCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { TagChip } from "@/components/shared/TagChip";
import { EmptyState } from "@/components/shared/EmptyState";
import { ALL_TAGS, TOPICS } from "@/lib/data/topics";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Library } from "lucide-react";

export default function TopicsPage() {
  const [query, setQuery] = React.useState("");
  const [activeTags, setActiveTags] = React.useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOPICS.filter((t) => {
      const matchesQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.concepts.some((c) => c.title.toLowerCase().includes(q));
      const matchesTags =
        activeTags.length === 0 ||
        activeTags.every((tag) => t.tags.includes(tag));
      return matchesQuery && matchesTags;
    });
  }, [query, activeTags]);

  const conceptCount = TOPICS.reduce((n, t) => n + t.concepts.length, 0);

  return (
    <div className="container py-12 md:py-16">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Topics" },
        ]}
      />
      <div className="mt-6 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-px w-6 bg-accent" />
          <p className="kicker !text-accent">Library</p>
        </div>
        <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          Every concept, one click from interactive.
        </h1>
        <p className="max-w-2xl text-pretty text-muted">
          {TOPICS.length} topics · {conceptCount} concepts. Filter by tag or
          type to narrow down. Real prototypes are landing topic-by-topic.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search topics or concepts (e.g. token bucket, LRU...)"
        />
        <div className="flex flex-wrap items-center gap-2">
          <span className="kicker pr-1">filter</span>
          {ALL_TAGS.map((tag) => (
            <TagChip
              key={tag}
              label={tag}
              active={activeTags.includes(tag)}
              onClick={() => toggleTag(tag)}
            />
          ))}
          {activeTags.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTags([])}
              className="ml-1"
            >
              Clear
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between border-b border-border-subtle pb-3">
        <p className="font-mono text-2xs uppercase tracking-[0.12em] text-subtle">
          {filtered.length === TOPICS.length
            ? `${TOPICS.length} topics`
            : `${filtered.length} of ${TOPICS.length} topics`}
        </p>
        <p className="font-mono text-2xs uppercase tracking-[0.12em] text-subtle">
          sort: curated
        </p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Library className="h-5 w-5" />}
          title="Nothing matches that yet"
          description="Try a different search or remove a filter or two."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setActiveTags([]);
              }}
            >
              Reset filters
            </Button>
          }
          className="mt-12"
        />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((topic, i) => (
            <TopicCard key={topic.slug} topic={topic} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
