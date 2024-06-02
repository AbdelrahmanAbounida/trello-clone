import React, { useEffect, useState } from "react";
import { ThemeProvider } from "./theme-provider";
import ModalProvider from "./modal-provider";
import { AuthProvider } from "./auth-provider";

export const AllProviders = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // const [isMounted, setisMounted] = useState(false);

  // useEffect(() => {
  //   setisMounted(true);
  // }, []);

  // // prevent hyderation error
  // if (!isMounted) {
  //   return null;
  // }
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" attribute="class">
        <ModalProvider />
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
};
