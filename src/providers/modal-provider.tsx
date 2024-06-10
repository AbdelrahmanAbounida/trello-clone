"use client";
import BoardModal from "@/components/modals/board-modal";
import WorkspaceModal from "@/components/modals/ws-modal";
import React, { useEffect, useState } from "react";

const ModalProvider = () => {
  return (
    <>
      {/**
       * ::TODO:: Put here list of all modals
       */}
      <WorkspaceModal />
      {/* <BoardModal /> */}
    </>
  );
};

export default ModalProvider;
