import { useParams } from "react-router-dom";
import { useGetData } from "../../customHooks/useGetData/useGetData";
import { useEffect } from "react";
import Loader from "../../components/loader/Loader";

const StoryDetail = () => {
  const { id } = useParams();
  const { data: story, isLoading } = useGetData(`/story/${id}`);
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <main className="pt-8 pb-16 px-4 overflow-hidden sm:px-8 lg:px-12 singleStory relative lg:pt-16 min-h-screen flex justify-center items-center lg:pb-24 bg-white antialiased">
        <div className="flex flex-col justify-between mx-auto max-w-full">
          <article className="mx-auto relative w-full format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
            <header className="mb-4 overflow-hidden  relative lg:mb-6 not-format">
              <figure className="w-full  lg:w-[80%]   mx-auto  flex justify-center items-center overflow-hidden ">
                <img
                  src={story[0]?.image}
                  alt=""
                  loading="lazy"
                  className=" w-full object-cover rounded mx-auto"
                />
              </figure>
            </header>
            <div className="relative block w-[90%] mx-auto  lg:w-full py-4 sm:py-6 lg:py-8 bg-white">
              <h1 className="mb-2 sm:mb-4  text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-gray-900">
                {story[0]?.title}
              </h1>
              <p className="text-xs sm:text-sm -mt-2 font-bold">
                By The Version Originale |{" "}
                {new Date(story[0].date).toDateString()}
              </p>
              <p
                className="text-sm sm:text-base mt-2 overflow-hidden leading-relaxed"
                dangerouslySetInnerHTML={{ __html: story[0]?.content }}
              ></p>
            </div>
          </article>
        </div>
      </main>
    </>
  );
};

export default StoryDetail;
