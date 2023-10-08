import { Link } from "react-router-dom";

const Error = () => {
  return (
    <section className="flex items-center h-full p-16 text-white bg-[#38453e] ">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-md text-center">
          <h2 className="mb-8 font-extrabold text-9xl dark:text-white">
            <span className="sr-only">Error</span>404
          </h2>
          <p className="text-2xl font-semibold md:text-3xl">
            Sorry, we couldnt find this page.
          </p>
          <p className="mt-4 mb-8 dark:text-white">
            But dont worry, you can find plenty of other things on our homepage.
          </p>
          <Link to={"/"}>
            <a
              href=""
              className="px-8 py-3 font-semibold rounded  dark:text-white"
            >
              Back to homepage
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Error;
