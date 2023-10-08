import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
export default function OrderDetailModal({
  data,
  isDetailOpen,
  setIsDetailOpen,
}) {
  function closeModal() {
    setIsDetailOpen(false);
  }

  return (
    <>
      <Transition appear show={isDetailOpen} as={Fragment}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    #{data?._id}
                  </Dialog.Title>
                  <div className="my-4">
                    <>
                      {data?.order_items &&
                      data?.order_items[0]?.added_by !== "admin" ? (
                        <div className="flex my-4 flex-col gap-4">
                          {" "}
                          <span className=" text-lg ">
                            firstName:
                            <span className="font-bold pl-2">
                              {data?.firstName}{" "}
                            </span>
                          </span>
                          <span className=" text-lg ">
                            lastName:
                            <span className="font-bold pl-2">
                              {data?.lastName}
                            </span>
                          </span>
                          <span className=" text-lg ">
                            phone:
                            <span className="font-bold pl-2">
                              {data?.phone}
                            </span>
                          </span>
                          <span className=" text-lg ">
                            email:
                            <span className="font-bold pl-2">
                              {data?.email}
                            </span>
                          </span>
                          <span className=" text-lg ">
                            address:
                            <span className="font-bold pl-2">
                              {data?.address}
                            </span>
                          </span>
                          <span className=" text-lg ">
                            apartment:
                            <span className="font-bold pl-2">
                              {data?.apartment}
                            </span>
                          </span>
                          <span className=" text-lg ">
                            city:
                            <span className="font-bold pl-2">{data?.city}</span>
                          </span>{" "}
                          <span className=" text-lg ">
                            state:
                            <span className="font-bold pl-2">
                              {data?.state}
                            </span>
                          </span>
                          <span className=" text-lg ">
                            postalCode:
                            <span className="font-bold pl-2">
                              {data?.postalCode}
                            </span>
                          </span>
                          <span className=" text-lg ">
                            country:
                            <span className="font-bold pl-2">
                              {data?.country}
                            </span>
                          </span>{" "}
                          <span className=" text-lg ">
                            method:
                            <span className="font-bold pl-2">
                              {data?.method}
                            </span>
                          </span>
                          <span className=" text-lg ">
                            totalPrice:
                            <span className="font-bold pl-2">
                              {data?.totalPrice}
                            </span>
                          </span>
                          <span className="text-lg ">
                            currency:
                            <span className="font-bold pl-2">
                              {data?.currency}
                            </span>
                          </span>
                          <span className=" text-lg ">
                            date:
                            <span className="font-bold pl-2">
                              {new Date(data?.date).toLocaleString()}
                            </span>
                          </span>
                        </div>
                      ) : (
                        <div className="flex my-4 flex-col gap-4">
                          <span className=" text-lg ">
                            method:
                            <span className="font-bold pl-2">
                              {data?.method}
                            </span>
                          </span>

                          <span className=" text-lg ">
                            totalPrice:
                            <span className="font-bold pl-2">
                              {data?.totalPrice}
                            </span>
                          </span>
                          <span className="text-lg ">
                            currency:
                            <span className="font-bold pl-2">
                              {data?.currency}
                            </span>
                          </span>

                          <span className=" text-lg ">
                            date:
                            <span className="font-bold pl-2">
                              {new Date(data?.date).toLocaleString()}
                            </span>
                          </span>
                          <h2 className="px-2 py-2 bg-green-100 w-fit">
                            Admin Order
                          </h2>
                        </div>
                      )}
                    </>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      X
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
