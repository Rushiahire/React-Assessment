import React, { useEffect } from "react";
import { client_id } from "../../services/config";

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleLoginButtonProps {
  onSuccess: (credential: string) => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess }) => {
  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id,
      callback: (response: any) => {
        onSuccess(response.credential); // <-- SEND RAW CREDENTIAL
      },
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      {
        theme: "outline",
        size: "large",
        width: "100%",
      }
    );
  }, [onSuccess]);

  return <div id="googleBtn"></div>;
};

export default GoogleLoginButton;
