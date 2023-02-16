import React, { useEffect, useState } from "react";
import {
  useExtensionApi, render, useApplyCartLinesChange, useCartLines, useSessionToken,
  BlockStack, Divider, Heading, InlineLayout, Image, Text, Button, Banner,
} from '@shopify/checkout-ui-extensions-react';

//render('Checkout::Dynamic::Render', () => <App />);
render('Checkout::Reductions::RenderAfter', () => <App />);

function App() {

  //Use i18n to format currencies, numbers, and translate strings
  const {extensionPoint, i18n} = useExtensionApi();
  const applyCartLinesChange = useApplyCartLinesChange();
  
  // Access the current cart lines and subscribe to changes
  const lines = useCartLines();
  const {get} = useSessionToken();
  const [state, setState] = useState({})
  const [upsellProducts, setUpsellProducts] = useState("loading")


  useEffect(() => {

    console.log(lines)

    let getData = async () => {
      
        try{

          /*
          const url = createUrl(shopDomain, "api/post-purchase/get-product");
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              product_id: lineItems[0].product.id,
              reference_id: referenceId,
              token,
            }),
          });
          const product = await res.json();
          */

          let token = await get()
          console.log("token")
          console.log(token)

          console.log( sessionToken.get() )
          console.log( sessionToken.getData() )

          let tempUpsellProducts = [
            { imgSrc: "https://cdn.shopify.com/s/files/1/0724/4054/5587/products/Main_b9e0da7f-db89-4d41-83f0-7f417b02831d_350x350.jpg?v=1675948757", 
              id: "gid://shopify/ProductVariant/44385856127283", 
              title: "The 3p Fulfilled Snowboard",
              price: 20.0
            }
          ]
          
          setUpsellProducts(tempUpsellProducts)

        } catch(err){
          setState({ buttonState: null });
        }

    }

    getData()

  }, [] )


  let clickedAddToCart = async (id) => {

    try{

      let token = await sessionToken.get()
      console.log("clickedAddToCart id: " + id)

      setState({ buttonState: "loading" });
      // Apply the cart lines change
      // https://shopify.dev/docs/api/checkout-ui-extensions/extension-points-api
      const result = await applyCartLinesChange({
        type: "addCartLine",
        merchandiseId: id,
        quantity: 1,
        attributes: [ {"trapp": "discount"}]
      });
      
      if (result.type === "error") {
        // An error occurred adding the cart line
        // Verify that you're using a valid product variant ID
        // For example, 'gid://shopify/ProductVariant/123'
        console.error(result.message);
        throw new Error(result.message)
      } else {
        setState({ buttonState: null });
      }

    } catch (err){

      //console.error(err)
      console.error(err.message)
      setState({errorMessage: err.message})
      setShowError(true);

    }

  }

  if ( upsellProducts === "loading" ) return null

  let {id, imgSrc, title, price } = upsellProducts[0]
  const renderPrice = i18n.formatCurrency(price);

  return (
    <BlockStack spacing="loose">
      <Divider />
      <Heading level={2}>You might also like</Heading>
      <BlockStack spacing="loose">
        <InlineLayout
          spacing="base"
          // Use the `columns` property to set the width of the columns
          // Image: column should be 64px wide
          // BlockStack: column, which contains the title and price, should "fill" all available space
          // Button: column should "auto" size based on the intrinsic width of the elements
          columns={[64, "fill", "auto"]}
          blockAlignment="center"
        >
          <Image
            border="base"
            borderWidth="base"
            borderRadius="loose"
            source={imgSrc}
            description={title}
            aspectRatio={1}
          />
          <BlockStack spacing="none">
            <Text size="medium" emphasis="strong">
              {title}
            </Text>
            <Text appearance="subdued">{renderPrice}</Text>
          </BlockStack>
          <Button
            kind="secondary"
            loading={state.buttonState === "loading"}
            accessibilityLabel={`Add ${title} to cart`}
            onPress={ ()=> clickedAddToCart(id) }
          >
            Add
          </Button>
        </InlineLayout>
      </BlockStack>
      {state.errorMessage && (
        <Banner status="critical">
          {state.errorMessage}
        </Banner>
      )}
    </BlockStack>
  );
}