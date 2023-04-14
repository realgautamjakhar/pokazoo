import React from "react";
import { gql } from "@apollo/client";
import client from "../../../../apollo-client";
import Image from "next/image";
import { TbWeight, TbAtom } from "react-icons/tb";
import EvolutionModal from "@/components/EvolutionModal";
type Params = {
  params: {
    name: string;
  };
};

export const generateMetadata = async ({ params: { name } }: Params) => {
  const {
    data: { pokemon },
  }: {
    data: {
      pokemon: Pokemon;
    };
  } = await client.query({
    query: gql`
      query pokemon($id: String, $name: String) {
        pokemon(id: $id, name: $name) {
          id
          number
          name
          weight {
            minimum
            maximum
          }
          height {
            minimum
            maximum
          }
          classification
          types
          resistant
          weaknesses
          fleeRate
          maxCP
          maxHP
          image
        }
      }
    `,
    variables: {
      name: name,
    },
  });
  return {
    title: pokemon.name,
  };
};

// No need to revalidate because data is not changing anyway but
export const revalidate = 300;
const page = async ({ params: { name } }: Params) => {
  const {
    data: { pokemon },
  }: {
    data: {
      pokemon: Pokemon;
    };
  } = await client.query({
    query: gql`
      query pokemon($id: String, $name: String) {
        pokemon(id: $id, name: $name) {
          id
          number
          name
          weight {
            minimum
            maximum
          }
          height {
            minimum
            maximum
          }
          classification
          types
          resistant
          weaknesses
          fleeRate
          maxCP
          maxHP
          image
        }
      }
    `,
    variables: {
      name: name,
    },
  });
  if (!pokemon) {
    return <h2>Pokemon Not found</h2>;
  }
  return (
    <main className=" grid  justify-center h-full py-16 px-4">
      <Image
        src={pokemon.image}
        height={450}
        width={450}
        alt={pokemon.name}
        className=" max-h-[500px] object-contain"
      />
      <div className=" grid gap-6">
        <p className="text-sm font-bold text-gray-300">#{pokemon.number}</p>
        <h2 className="text-[clamp(1rem,10vw,3rem)] font-bold text-gray-900">
          {pokemon.name}
        </h2>
        <EvolutionModal pokemon={pokemon} />
        <p>
          Classification :{" "}
          <span className=" font-bold text-base">
            {" "}
            {pokemon.classification}
          </span>
        </p>{" "}
        <p>
          Type :{" "}
          {pokemon.types.map((t) => {
            return (
              <span className=" font-bold text-base" key={t}>
                {t}
              </span>
            );
          })}
        </p>
        <div className=" grid grid-cols-2 gap-6">
          <div className=" p-2 rounded-md justify-center items-center hover:bg-gray-300 duration-300 ease-in-out bg-gray-100 text-center">
            <p className=" flex flex-col">
              <span className=" text-xs text-gray-700">Max CP</span>
              <span className=" font-bold text-gray-900 text-lg">
                {pokemon.maxCP}
              </span>
            </p>
          </div>
          <div className=" p-2 rounded-md justify-center items-center hover:bg-gray-300 duration-300 ease-in-out bg-gray-100 text-center">
            <p className=" flex flex-col">
              <span className=" text-xs text-gray-700">Max Hp</span>
              <span className=" font-bold text-gray-900 text-lg">
                {pokemon.maxHP}
              </span>
            </p>
          </div>
        </div>
        <div className=" grid sm:grid-cols-2 gap-6">
          <div className=" ring-1 gap-4 grid bg-white p-4 ring-gray-200 rounded-md shadow-2xl shadow-gray-200">
            <h2 className=" inline-flex items-center gap-1">
              <TbWeight size={24} color="gray" />
              <span className=" font-bold">Weight</span>
            </h2>
            <div>
              <p>Minimum Weight : {pokemon.weight.minimum}</p>
              <p>Maximum Weight : {pokemon.weight.maximum}</p>
            </div>
          </div>
          <div className=" ring-1 gap-4 grid bg-white p-4 ring-gray-200 rounded-md shadow-2xl shadow-gray-200">
            <h2 className=" inline-flex items-center gap-1">
              <TbAtom size={24} color="gray" />
              <span className=" font-bold">Height</span>
            </h2>
            <div>
              <p>Minimum Height : {pokemon.height.minimum}</p>
              <p>Maximum Height : {pokemon.height.maximum}</p>
            </div>
          </div>
        </div>
        <div className=" ring-1 gap-4 grid bg-white p-4 ring-gray-200 rounded-md shadow-2xl shadow-gray-200">
          <h2 className=" flex items-center gap-1 ">
            <TbAtom size={24} color="gray" />
            <span className=" font-bold">Resistant</span>
          </h2>
          <ul className=" flex flex-wrap gap-6">
            {pokemon.resistant.map((res) => {
              return (
                <li
                  className=" bg-white ring-1 ring-green-400 rounded-full px-4 py-[2px]"
                  key={res}
                >
                  {res}
                </li>
              );
            })}
          </ul>
        </div>
        <div className=" ring-1 gap-4 grid bg-white p-4 ring-gray-200 rounded-md shadow-2xl shadow-gray-200">
          <h2 className=" flex items-center gap-1 ">
            <TbAtom size={24} color="gray" />
            <span className=" font-bold">Weaknesses</span>
          </h2>
          <ul className=" flex flex-wrap gap-6">
            {pokemon.weaknesses.map((r) => {
              return (
                <li
                  className=" bg-white ring-1 ring-red-400 rounded-full px-4 py-[2px]"
                  key={r}
                >
                  {r}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default page;

export async function generateStaticParams() {
  //Generating first 20 pokemon static page
  const { data } = await client.query({
    query: gql`
      query pokemons($first: Int!) {
        pokemons(first: $first) {
          name
        }
      }
    `,
    variables: {
      first: 20,
    },
  });
  return data.pokemons.map((pokemon: Pokemon) => {
    return {
      name: pokemon.name,
    };
  });
}
