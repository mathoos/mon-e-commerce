"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import supabase from "@/lib/supabase";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import Header from "../components/Header";

type Produit = {
    id: string;
    nom: string;
    description: string;
    prix: number;
    image: string;
    categorie: string;
};

export default function Home() {
    const [produits, setProduits] = useState<Produit[]>([]);
    const [categorieFiltre, setCategorieFiltre] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const { ajouterAuPanier } = useCart();
    const { recherche } = useSearch();

    useEffect(() => {
        async function fetchProduits() {
            const { data, error } = await supabase.from("produits").select("*");
            if (error) {
                console.error(error);
            } else {
                setProduits(data);
                const allCategories = ["Soin", "Sérum", "Crème"];
                const uniqueCategories = Array.from(new Set(data.map((prod) => prod.categorie).filter(cat => cat)));
                setCategories(Array.from(new Set([...allCategories, ...uniqueCategories])));
            }
        }
        fetchProduits();
    }, []);

    const produitsFiltres = produits.filter(
        (produit) =>
            (!categorieFiltre || produit.categorie === categorieFiltre) &&
            produit.nom.toLowerCase().includes(recherche.toLowerCase())
    );

    return (
        <div className="w-full">
            <Header />

            <div className="bg-[var(--quaternary)] py-[5vh] md:py-[15vh] px-[30px] md:px-[10vw]">
                <p className="text-[5vw] md:text-[2.5vw] text-[var(--primary)]">Nos formules sont : courtes, concentrées, fabriquées en France</p>
            </div>

            <div className="sticky top-[6vh] md:top-[-10vh] flex flex-col gap-[2vh] justify-between py-[5vh] md:py-[20vh] px-[30px] md:px-[10vw] pb-[auto] md:pb-[2vw] bg-[var(--secondary)]">
                <h2 className="text-[7vw] md:text-[2.5vw] text-[var(--primary)]">Nos produits</h2>

                <div className="flex gap-[5vw] md:gap-[2vw] flex-wrap">
                    <button 
                        onClick={() => setCategorieFiltre(null)}
                        className={`text-[3.5vw] md:text-[1.5vw] border border-[var(--primary)] px-[15px] md:px-[30px] py-[5px] md:py-[1vh] md:grow-0 grow last:grow-0 ${categorieFiltre === null ? "bg-[var(--primary)] text-[var(--secondary)]" : "text-[var(--primary)]"}`}
                    >
                        Tous
                    </button>
                    {categories.map((cat) => (
                        <button 
                            key={cat}
                            onClick={() => setCategorieFiltre(cat)}
                            className={`text-[3.5vw] md:text-[1.5vw] border border-[var(--primary)] px-[15px] md:px-[30px] py-[5px] md:py-[1vh] md:grow-0 grow last:grow-0 ${categorieFiltre === cat ? "bg-[var(--primary)] text-[var(--secondary)]" : "text-[var(--primary)]"}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="md:py-[20vh] py-[10vh] md:px-[10vw] px-[30px] bg-[var(--secondary)]">
                {produitsFiltres.length === 0 ? (
                    <p>Aucun produit trouvé</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-[30px] md:gap-[5vw]">
                        {produitsFiltres.map((produit) => (
                            <div key={produit.id} className="flex flex-col justify-between gap-[15px] md:gap-[30px] bg-white p-[15px] md:p-[30px]">
                                <Link href={`/produit/${produit.id}`} className="flex flex-col gap-[15px] md:h-auto h-full">
                                    <h2 className="text-[3vw] md:text-[1vw] text-[var(--primary)] font-bold h-full">{produit.nom}</h2>
                                    <img src={produit.image} alt={produit.nom} className="w-full h-[80px] md:h-[20vw] object-cover"/>
                                </Link>
                                <div className="flex md:flex-row flex-col gap-[1vh] md:gap-[2vh] justify-between items-center">
                                    <p className="text-[3vw] md:text-[1vw] text-[var(--primary)]">{produit.prix} €</p>
                                    <button className="text-[var(--primary)] text-[2.5vw] md:text-[1vw] border border-[var(--primary)] px-[15px] md:px-[30px] py-[5px] md:py-[1vh]" onClick={() => ajouterAuPanier({ ...produit, quantite: 1 })}>
                                        Ajouter au panier
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
