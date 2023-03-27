module Ccap.HtmlRender.Render
  ( prependDocType
  , render
  , _pretty
  ) where

import Prelude
import Data.Newtype (unwrap)
import Effect (Effect)
import Halogen.HTML as HH
import Halogen.VDom.DOM.StringRenderer as StringRenderer

foreign import _pretty :: String -> Effect String

render ::
  forall i w.
  HH.HTML i w ->
  String
render html =
  StringRenderer.render
    (const "<!-- I do not know how to render a widget -->")
    (unwrap html)

prependDocType :: String -> String
prependDocType = (<>) "<!DOCTYPE html>"
