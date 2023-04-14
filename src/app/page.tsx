import { gql } from "@apollo/client";
import client from "../../apollo-client";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { data } = await client.query({
    query: gql`
      query pokemons($first: Int!) {
        pokemons(first: $first) {
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
      first: 20,
    },
  });

  return (
    <main className=" pb-16">
      <ul className=" w-full grid grid-cols-1  sm:grid-cols-[repeat(auto-fit,clamp(15rem,10vw,20rem))] place-content-center  gap-10">
        {data?.pokemons?.map((pokemon: Pokemon) => {
          return (
            <li
              key={pokemon.id}
              className=" grid p-4 gap-4 w-full rounded-md place-content-center hover:-translate-y-1 shadow-2xl shadow-gray-100 hover:shadow-gray-300 duration-300 ease-in-out  ring-1 ring-gray-300"
            >
              <Link
                href={`/pokemon/${pokemon.name}`}
                className=" cursor-pointer"
                prefetch={false}
              >
                <Image
                  src={pokemon.image}
                  alt={pokemon.name}
                  width={250}
                  height={250}
                  className=" object-contain aspect-square"
                />
              </Link>
              <div className="grid gap-1">
                <h2 className="text-sm font-bold text-gray-300">
                  #{pokemon.number}
                </h2>
                <h2 className="text-2xl font-medium">{pokemon.name}</h2>
                <h2 className="text-xs bg-gray-900 rounded-full text-white w-fit px-4 py-[2px]">
                  {pokemon.types[0]}
                </h2>
              </div>
            </li>
          );
        })}
      </ul>
      <div className=" flex items-center justify-center mt-6 gap-6">
        <Link
          className="bg-white px-4 py-2 font-medium text-gray-900 ring-2 ring-gray-200 rounded-full hover:ring-gray-400 duration-300 ease-in-out "
          href={`/page/2`}
        >
          Next
        </Link>
      </div>
    </main>
  );
}
