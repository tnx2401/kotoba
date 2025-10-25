export const showModal = (id: string) => {
  const modal = document.getElementById(id) as HTMLDialogElement | null;
  if (modal) {
    modal.showModal();
  }
};
