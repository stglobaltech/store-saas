import { openModal } from "@redq/reuse-modal";
import PrevOrderPending from "./PrevOrderPending";

export const handlePrevOrderPending = () => {
  openModal({
    show: true,
    overlayClassName: "quick-view-overlay",
    closeOnClickOutside: true,
    component: PrevOrderPending,
    closeComponent: "",
    config: {
      enableResizing: false,
      disableDragging: true,
      className: "quick-view-modal",
      width: 458,
      height:458
    },
  });
};
