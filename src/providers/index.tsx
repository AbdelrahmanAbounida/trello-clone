import React, { useEffect, useState } from "react";
import { ThemeProvider } from "./theme-provider";
import ModalProvider from "./modal-provider";
import { AuthProvider } from "./auth-provider";

export const AllProviders = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" attribute="class">
        <ModalProvider />
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
};
