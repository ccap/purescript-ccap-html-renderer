module Test.Ccap.HtmlRender.Render
  ( specs
  ) where

import Prelude
import Ccap.HtmlRender.Render as Render
import Effect (Effect)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Data.MediaType (MediaType(..))
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP

specs :: Effect (Spec Unit)
specs = do
  output <- Render._pretty $ Render.prependDocType $ Render.render page
  pure
    $ describe "The render code" do
        it "Renders an HTML file" do
          (output `shouldEqual` sample)
  where
  sample =
    """<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hello world - Home</title>
    <link rel="icon" href="images/lady-justice.png" type="image/png" />
    <link rel="stylesheet" href="css/font-awesome.min.css" type="text/css" />
    <link rel="stylesheet" href="/stylesheets/default.css" type="text/css" />
    <script src="scripts/index.js?a=1" async="async" defer="defer"></script>
    <script src="/js/commons.packed.js"></script>
    <script src="/js/index.packed.js"></script>
  </head>

  <body></body>

</html>"""

  page :: forall i w. HH.HTML i w
  page =
    HH.html
      [ HP.attr (HH.AttrName "lang") "en"
      ]
      [ HH.head_
          [ HH.meta
              [ HP.charset "utf-8"
              ]
          , HH.meta
              [ HP.name "viewport"
              , HP.attr (HH.AttrName "content") "width=device-width, initial-scale=1.0"
              ]
          , HH.title_ [ HH.text "Hello world - Home" ]
          , HH.link
              [ HP.rel "icon"
              , HP.href "images/lady-justice.png"
              , HP.type_ (MediaType "image/png")
              ]
          , HH.link
              [ HP.rel "stylesheet"
              , HP.href "css/font-awesome.min.css"
              , HP.type_ (MediaType "text/css")
              ]
          , HH.link
              [ HP.rel "stylesheet"
              , HP.href "/stylesheets/default.css"
              , HP.type_ (MediaType "text/css")
              ]
          , HH.script
              [ HP.src "scripts/index.js?a=1"
              , HP.attr (HH.AttrName "async") "async"
              , HP.attr (HH.AttrName "defer") "defer"
              ]
              []
          , HH.script
              [ HP.src "/js/commons.packed.js"
              ]
              []
          , HH.script
              [ HP.src "/js/index.packed.js"
              ]
              []
          ]
      , HH.body_ []
      ]
