'use client'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { database } from "@/lib/firebaseService";
import { set, ref } from "firebase/database";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loading from "@/components/loading";

export default function PromoteToAdmin() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        const adminRef = ref(database, `admins/${uid}`);
        
        // Promover o usuário a administrador
        set(adminRef, true)
          .then(() => {
            setMessage(`${user.displayName} promovido a administrador com sucesso.`);
            setLoading(false);
          })
          .catch((error) => {
            setMessage("Erro ao promover usuário a administrador: " + error.message);
            setLoading(false);
          });
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 lg:p-24 bg-fj">
      <Card>
        <CardHeader>
          <CardTitle>
            Coisa boa!
          </CardTitle>
        </CardHeader>
        <CardContent>
          {message}
        </CardContent>
        <CardFooter>
        <Button className="w-full" onClick={() => router.push('/admin/confirmados')}>Ir para a página de confirmados</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
