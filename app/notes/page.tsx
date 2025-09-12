// app/notes/page.tsx
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

export const revalidate = 0;

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const page = Number(sp?.page ?? "1") || 1;
  const perPage = 12;
  const q = (sp?.q ?? "").trim();

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ["notes", page, perPage, q],
    queryFn: () => fetchNotes({ page, perPage, search: q }),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient initialPage={page} perPage={perPage} initialQuery={q} />
    </HydrationBoundary>
  );
}
