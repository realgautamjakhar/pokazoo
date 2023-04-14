"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import client from "../../apollo-client";
import { gql } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
interface Data {
  pokemon: {
    evolutions: [Pokemon];
    id: string;
    name: string;
    __typename: string;
  };
}
function EvolutionModal({ pokemon }: { pokemon: Pokemon }) {
  let [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<Data>();
  const [loading, setLoading] = useState(false);
  const fetchEvolutionData = async (pokemon: Pokemon) => {
    try {
      setLoading(true);
      const { data } = await client.query({
        query: gql`
          query pokemon($id: String, $name: String) {
            pokemon(id: $id, name: $name) {
              id
              name
              evolutions {
                id
                number
                name
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
          }
        `,
        variables: {
          id: pokemon.id,
          name: pokemon.name,
        },
      });
      setLoading(false);
      setData(data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isOpen) {
      fetchEvolutionData(pokemon);
    }
  }, [isOpen, pokemon]);
  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-300 duration-300 ease-in-out bg-gray-100 text-gray-900 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        Evolution
      </button>

      {isOpen && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-h-[80dvh] overflow-scroll max-w-lg transform  rounded-md bg-white p-4 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-bold leading-6 text-gray-900 mb-4"
                    >
                      Evolution
                    </Dialog.Title>
                    {loading && <p>Loading</p>}
                    {data && (
                      <div>
                        <ul className=" grid gap-4">
                          {data?.pokemon?.evolutions?.map((e: Pokemon) => {
                            return (
                              <li
                                key={e.id}
                                className=" grid  rounded-md md:grid-cols-[auto_1fr] gap-6 ring-1 ring-gray-200 p-4"
                              >
                                <Image
                                  src={e.image}
                                  width={100}
                                  height={100}
                                  className="  min-w-[100px] aspect-square object-contain m-auto"
                                  alt={e.name}
                                />
                                <div className=" grid gap-4">
                                  <div className=" text-center md:text-end">
                                    <p className="text-sm font-bold text-gray-300">
                                      #{e.number}
                                    </p>
                                    <Link
                                      href={`/pokemon/${e.name}`}
                                      className=" hover:text-red-300 duration-300 ease-in-out text-[clamp(1rem,10vw,2rem)] font-bold text-gray-900"
                                    >
                                      {e.name}
                                    </Link>
                                  </div>
                                  <div className=" grid grid-cols-2 gap-6">
                                    <div className=" p-2 rounded-md justify-center items-center hover:bg-gray-300 duration-300 ease-in-out bg-gray-100 text-center">
                                      <p className=" flex flex-col">
                                        <span className=" text-xs text-gray-700">
                                          Max CP
                                        </span>
                                        <span className=" font-bold text-gray-900 text-lg">
                                          {e.maxCP}
                                        </span>
                                      </p>
                                    </div>
                                    <div className=" p-2 rounded-md justify-center items-center hover:bg-gray-300 duration-300 ease-in-out bg-gray-100 text-center">
                                      <p className=" flex flex-col">
                                        <span className=" text-xs text-gray-700">
                                          Max Hp
                                        </span>
                                        <span className=" font-bold text-gray-900 text-lg">
                                          {e.maxHP}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                  <div className=" flex gap-6 ">
                                    <p className=" text-xs">Weakness</p>
                                    <ul className="  flex flex-wrap gap-x-6 gap-2">
                                      {e.weaknesses.map((w) => {
                                        return (
                                          <li
                                            key={w}
                                            className=" px-4 py-[2px] ring-red-300 ring-1 rounded-full"
                                          >
                                            <p className=" text-xs">{w}</p>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                  <div className=" flex gap-6 ">
                                    <p className=" text-xs">Resistant</p>
                                    <ul className="  flex flex-wrap gap-x-6 gap-2">
                                      {e.resistant.map((r) => {
                                        return (
                                          <li
                                            key={r}
                                            className=" px-4 py-[2px] ring-green-300 ring-1 rounded-full"
                                          >
                                            <p className=" text-xs">{r}</p>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                    {!loading && !data?.pokemon?.evolutions && (
                      <p>No Evolution Found</p>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
}
export default EvolutionModal;
