import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import { I18nContext, I18nManager } from "@shopify/react-i18n";
import Routes from "./Routes";

import {
  AppBridgeProvider,
  DiscountProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  const locale = 'en';
  const i18nManager = new I18nManager({
    locale,
    onError(error) {
      console.error(error)
    },
  });

  console.log("locale: " + locale)
  //<I18nContext.Provider value={i18nManager}>

  return (
    <PolarisProvider>
    <BrowserRouter>
      <AppBridgeProvider>
        <DiscountProvider>
          <QueryProvider>
            <Routes pages={pages} />
          </QueryProvider>
        </DiscountProvider>
      </AppBridgeProvider>
    </BrowserRouter>
  </PolarisProvider>
  );
}
