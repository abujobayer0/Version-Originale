import React, { Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
const Layout = React.lazy(() => import("../layout/layout"));
const Home = React.lazy(() => import("../pages/Home/home"));
const Login = React.lazy(() => import("../pages/Login/login"));
const Wishlist = React.lazy(() => import("../pages/Wishlist/wishlist"));
const Contact = React.lazy(() => import("../pages/Contact/contact"));
const SingleProduct = React.lazy(() =>
  import("../pages/SingleProduct/singleProduct")
);
const BestSelling = React.lazy(() =>
  import("../pages/BestSelling/bestSelling")
);
const LatestDrops = React.lazy(() => import("../pages/NewDrop/newDrop"));
const Collections = React.lazy(() =>
  import("../pages/Collections/collections")
);
const Ss23 = React.lazy(() => import("../pages/Ss23/ss23"));
const Cart = React.lazy(() => import("../pages/Cart/cart"));
const Checkout = React.lazy(() => import("../pages/Checkout/checkout"));
const AdminPanel = React.lazy(() => import("../pages/admin/admin"));
const Error = React.lazy(() => import("../pages/error/error"));
const Dashboard = React.lazy(() => import("../components/dashboard/dashboard"));
const ProductAdd = React.lazy(() =>
  import("../components/productAdd/productAdd")
);
const ProductTable = React.lazy(() =>
  import("../components/adminProductTable/adminProductTable")
);
const OrderList = React.lazy(() =>
  import("../components/adminOrderList/adminOrderList")
);
const AdminCustomerTable = React.lazy(() =>
  import("../components/adminCusomerTable/adminCustomerTable")
);
const AdminCategory = React.lazy(() =>
  import("../components/adminCategory/adminCategory")
);
const Categories = React.lazy(() => import("../pages/categories/categories"));
const Search = React.lazy(() => import("../pages/search/search"));
const StoriesPage = React.lazy(() =>
  import("../pages/stories_page/storiesPage")
);
const CategoryDetail = React.lazy(() =>
  import("../pages/categoryDetail/categoryDetail")
);
const UserProfile = React.lazy(() =>
  import("../pages/userProfile/userProfile")
);
const StoryDetail = React.lazy(() =>
  import("../pages/storyDetail/storyDetail")
);
const PrivateProvider = React.lazy(() =>
  import("../provider/PrivateProvider/PrivateProvider")
);
const AdminProvider = React.lazy(() =>
  import("../provider/AdminProvider/AdminProvider")
);
const StoryAddPage = React.lazy(() =>
  import("../components/storyAdd/storyAdd")
);
const CouponCodePage = React.lazy(() =>
  import("../components/couponCode/CouponCodePage")
);
const ContactForm = React.lazy(() =>
  import("../components/contactForm/ContactForm")
);
const Faq = React.lazy(() => import("../components/faq/Faq"));
const ShipingAndReturn = React.lazy(() =>
  import("../components/shippingAndReturn/shipingAndReturn")
);
const SSLayout = React.lazy(() => import("../layout/SSLayout"));
const Artestic = React.lazy(() => import("../pages/Artistic/artistic"));
const Anime = React.lazy(() => import("../pages/Anime/anime"));
const Retro = React.lazy(() => import("../pages/Retro/retro"));
const Cartoonish = React.lazy(() => import("../pages/Cartoonish/cartoonish"));
const ProductEditPage = React.lazy(() =>
  import("../pages/productEditPage/productEditPage")
);
const StoryUpdateForm = React.lazy(() =>
  import("../pages/storyUpdatePage/storyUpdatePage")
);
const About = React.lazy(() => import("../pages/about/about"));
const UserOrderPage = React.lazy(() =>
  import("../components/userOrderPage/userOrderPage")
);
const UserProfileComp = React.lazy(() =>
  import("../components/userProfileComp/userProfileComp")
);
const Fw23 = React.lazy(() => import("../pages/fw23/fw23"));
const Panjabi = React.lazy(() => import("../pages/panjabi/panjabi"));
const Jersey = React.lazy(() => import("../pages/jersey/jersey"));
import { useCurrency } from "../context/CurrencyContext";

const Router = () => {
  const { selectedCurrency } = useCurrency();
  const countryRoute = selectedCurrency === "BDT" ? "bd" : "uae";
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout></Layout>,
      children: [
        {
          path: "/",
          element: <Home></Home>,
        },

        {
          path: `/${countryRoute}`,
          element: <Home></Home>,
        },
        {
          path: `/${countryRoute}/login`,
          element: <Login></Login>,
        },
        {
          path: `/${countryRoute}/about`,
          element: <About />,
        },
        {
          path: `/${countryRoute}/wishlist`,
          element: <Wishlist></Wishlist>,
        },
        {
          path: `/${countryRoute}/panjabi`,
          element: <Panjabi />,
        },
        {
          path: `/${countryRoute}/jersey`,
          element: <Jersey />,
        },
        {
          path: `/${countryRoute}/contact`,
          element: (
            <Contact>
              <ContactForm />
            </Contact>
          ),
        },
        {
          path: `/${countryRoute}/contact`,
          element: (
            <Contact>
              <ContactForm />
            </Contact>
          ),
        },
        {
          path: `/${countryRoute}/contact/us`,
          element: (
            <Contact>
              <ContactForm />
            </Contact>
          ),
        },
        {
          path: `/${countryRoute}/contact/faq`,
          element: (
            <Contact>
              <Faq />
            </Contact>
          ),
        },

        {
          path: `/${countryRoute}/contact/shipping-return`,
          element: (
            <Contact>
              <ShipingAndReturn />
            </Contact>
          ),
        },
        {
          path: `/${countryRoute}/categories`,
          element: <Categories></Categories>,
        },
        {
          path: `/${countryRoute}/product/:_id`,
          element: <SingleProduct></SingleProduct>,
        },
        {
          path: `/${countryRoute}/best-selling`,
          element: <BestSelling></BestSelling>,
        },
        {
          path: `/${countryRoute}/ss23`,
          element: <Ss23></Ss23>,
        },
        {
          path: `/${countryRoute}/fw23`,
          element: <Fw23 />,
        },
        {
          path: `/${countryRoute}/new-drop`,
          element: <LatestDrops></LatestDrops>,
        },
        {
          path: `/${countryRoute}/collections`,
          element: <Collections></Collections>,
        },
        {
          path: `/${countryRoute}/cart`,
          element: (
            <PrivateProvider>
              <Cart></Cart>
            </PrivateProvider>
          ),
        },
        {
          path: `/${countryRoute}/checkout`,
          element: (
            <PrivateProvider>
              <Checkout></Checkout>
            </PrivateProvider>
          ),
        },
        {
          path: `/${countryRoute}/story`,
          element: <StoriesPage />,
        },
        {
          path: `/${countryRoute}/search/:query`,
          element: <Search />,
        },
        {
          path: `/${countryRoute}/category/:query`,
          element: <CategoryDetail />,
        },
        {
          path: `/user/panel`,
          element: (
            <PrivateProvider>
              <UserProfile />,
            </PrivateProvider>
          ),
        },
        {
          path: `/user/profile`,
          element: (
            <PrivateProvider>
              <UserProfileComp />,
            </PrivateProvider>
          ),
        },
        {
          path: `/${countryRoute}/story/:id`,
          element: <StoryDetail />,
        },
      ],
    },

    {
      path: `/${countryRoute}/ss23/artistic`,
      element: (
        <SSLayout>
          <Artestic />
        </SSLayout>
      ),
    },
    {
      path: `/${countryRoute}/ss23/anime`,
      element: (
        <SSLayout>
          <Anime />
        </SSLayout>
      ),
    },
    {
      path: `/${countryRoute}/ss23/retro`,
      element: (
        <SSLayout>
          <Retro />
        </SSLayout>
      ),
    },
    {
      path: `/${countryRoute}/ss23/cartoonish`,
      element: (
        <SSLayout>
          <Cartoonish />
        </SSLayout>
      ),
    },
    {
      path: "/admin",
      element: (
        <AdminProvider>
          <AdminPanel></AdminPanel>
        </AdminProvider>
      ),
      children: [
        { path: "", element: <Dashboard></Dashboard> },
        { path: "admin-product-add", element: <ProductAdd></ProductAdd> },
        { path: "admin-products", element: <ProductTable></ProductTable> },
        { path: "admin-orderlist", element: <OrderList /> },
        { path: "admin-category-manage", element: <AdminCategory /> },
        { path: "admin-story-add", element: <StoryAddPage /> },
        {
          path: "admin-customer-manage",
          element: <AdminCustomerTable></AdminCustomerTable>,
        },
        { path: "admin-couponCode", element: <CouponCodePage /> },
      ],
    },
    {
      path: "/admin/edit/product/:id",
      element: <ProductEditPage />,
    },

    {
      path: `/admin/story/update/:id`,
      element: <StoryUpdateForm />,
    },
    {
      path: "/admin/order/user/:email",
      element: <UserOrderPage />,
    },
    {
      path: "*",
      element: <Home />,
    },
  ]);
  return (
    <Suspense
      fallback={
        <>
          <p className="w-full h-screen flex justify-center text-[#839F90] items-center">
            Loading...
          </p>
        </>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
};
export default Router;
