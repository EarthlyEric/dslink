"use client";
import { useSession, signIn ,signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function Dashboard(){
    const {data: session} = useSession();

    if(session){
        // User is signed in
        return(
            <main className="flex justify-center items-center px-6 py-24 sm:py-32 lg:px-8 mx-10 border-4">
                <div className="mt-2">
                    <button onClick={() => signOut()} className="rounded-md bg-indigo-600 px-10 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        <FontAwesomeIcon icon={["fab", "discord"]} className="mr-2"/>
                        Logout
                    </button>
                </div>
                <p>{session.user?.email}</p>
            </main>
        )
    }
    // User is not signed in
    return(
        <main className="flex justify-center items-center px-6 py-24 sm:py-32 lg:px-8 mx-10 border-4">
            <div className="mt-2">
                <button onClick={() => signIn("discord")} className="rounded-md bg-indigo-600 px-10 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    <FontAwesomeIcon icon={["fab", "discord"]} className="mr-2"/>
                    Login with Discord
                </button>
            </div>
        </main>
    )
}   