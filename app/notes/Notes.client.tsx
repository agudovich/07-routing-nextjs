// app/notes/Notes.client.tsx
"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes, type FetchNotesResponse } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./page.module.css";

export interface NotesClientProps {
  initialPage: number;
  perPage: number;
  initialQuery: string;
}

export default function NotesClient({
  initialPage,
  perPage,
  initialQuery,
}: NotesClientProps) {
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialQuery);
  const [debouncedSearch] = useDebounce(search, 400);
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, perPage, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage, search: debouncedSearch }),
    placeholderData: (prev) => prev,
  });

  const totalPages = data?.totalPages ?? 1;
  const notes = data?.notes ?? [];

  return (
    <main>
      <div className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={() => setIsOpen(true)}>
          Create note +
        </button>
      </div>

      <NoteList notes={notes} />

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <NoteForm onCancel={() => setIsOpen(false)} />
      </Modal>
    </main>
  );
}
