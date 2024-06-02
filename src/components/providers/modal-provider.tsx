"use client";
import React, { useEffect, useState } from "react";

const ModalProvider = () => {
  const [isMounted, setisMounted] = useState(false);

  useEffect(() => {
    setisMounted(true);
  }, []);

  // prevent hyderation error
  if (!isMounted) {
    return null;
  }
  return (
    <>
      {/**
       * ::TODO:: Put here list of all modals
       */}
    </>
  );
};

export default ModalProvider;
