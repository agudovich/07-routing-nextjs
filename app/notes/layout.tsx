export default function NotesLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode; // слот @modal
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
