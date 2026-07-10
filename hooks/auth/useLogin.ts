import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AxiosError } from "axios";
import { useAuthContext } from "@/providers/AuthProvider";
import { showToast } from "@/utils/toast";

export const useLogin = () => {
    const router = useRouter();
    const { login: contextLogin } = useAuthContext();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            if (data?.status === false) {
                const msg = data.message || "Login failed";
                setErrorMsg(msg);
                showToast.error(msg);
                return;
            }

            const token = data?.token || data?.data?.token || data?.data?.access_token;
            const user = data?.user || data?.data?.user;

            if (token && user) {
                contextLogin(token, user);
                setErrorMsg(null);
                showToast.success("Logged in successfully!");
                router.push("/home");
            } else {
                const msg = "Login failed: Invalid session payload returned by server";
                setErrorMsg(msg);
                showToast.error(msg);
            }
        },
        onError: (err: AxiosError<{ message?: string }>) => {
            const message = err.response?.data?.message || err.message || "Something went wrong";
            setErrorMsg(message);
            showToast.error(message);
        },
    });

    return {
        ...mutation,
        errorMsg,
        setErrorMsg,
    };
};
