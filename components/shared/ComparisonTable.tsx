import type { ComparisonRow } from "@/lib/content/types";

export function ComparisonTable({
  headers,
  rows,
}: {
  headers: {
    algorithm: string;
    bursts: string;
    precision: string;
    memory: string;
    bestFor: string;
  };
  rows: ComparisonRow[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-elevated">
      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-sunken/60 text-left">
              <Th>{headers.algorithm}</Th>
              <Th>{headers.bursts}</Th>
              <Th>{headers.precision}</Th>
              <Th>{headers.memory}</Th>
              <Th>{headers.bestFor}</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.algorithm}
                className="border-t border-border-subtle transition-colors hover:bg-surface"
              >
                <td className="px-4 py-3 align-top">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xs text-subtle">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-medium text-foreground">
                      {row.algorithm}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 align-top text-muted">{row.bursts}</td>
                <td className="px-4 py-3 align-top text-muted">
                  {row.precision}
                </td>
                <td className="px-4 py-3 align-top">
                  <code className="rounded-sm border border-border-subtle bg-surface px-1.5 py-0.5 font-mono text-2xs text-muted">
                    {row.memory}
                  </code>
                </td>
                <td className="px-4 py-3 align-top text-muted">{row.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="divide-y divide-border-subtle md:hidden">
        {rows.map((row, i) => (
          <div key={row.algorithm} className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="font-mono text-2xs text-subtle">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-semibold text-foreground">
                {row.algorithm}
              </span>
            </div>
            <dl className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1.5 text-sm">
              <dt className="font-mono text-2xs uppercase tracking-[0.08em] text-subtle">
                {headers.bursts}
              </dt>
              <dd className="text-muted">{row.bursts}</dd>
              <dt className="font-mono text-2xs uppercase tracking-[0.08em] text-subtle">
                {headers.precision}
              </dt>
              <dd className="text-muted">{row.precision}</dd>
              <dt className="font-mono text-2xs uppercase tracking-[0.08em] text-subtle">
                {headers.memory}
              </dt>
              <dd>
                <code className="rounded-sm border border-border-subtle bg-surface px-1.5 py-0.5 font-mono text-2xs text-muted">
                  {row.memory}
                </code>
              </dd>
              <dt className="font-mono text-2xs uppercase tracking-[0.08em] text-subtle">
                {headers.bestFor}
              </dt>
              <dd className="text-muted">{row.bestFor}</dd>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 font-mono text-2xs uppercase tracking-[0.12em] text-muted">
      {children}
    </th>
  );
}
