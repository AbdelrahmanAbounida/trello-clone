"use client";
import BoardModal from "@/components/modals/board-modal";
import CardModal from "@/components/modals/card-modal";
import WorkspaceModal from "@/components/modals/ws-modal";
import React, { useEffect, useState } from "react";

// for modal types that u wanna show with click event without showing buttons /...
const ModalProvider = () => {
  return (
    <>
      {/**
       * ::TODO:: Put here list of all modals
       */}
      <WorkspaceModal />
      <CardModal />
      {/* <BoardModal /> */}
    </>
  );
};

export default ModalProvider;
