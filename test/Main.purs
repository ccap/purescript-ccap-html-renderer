module Test.Main where

import Prelude
import Effect (Effect)
import Effect.Aff (launchAff_)
import Test.Ccap.HtmlRender.Render as Render
import Test.Spec.Reporter.Console (consoleReporter)
import Test.Spec.Runner (runSpec)

main :: Effect Unit
main = do
  rspecs <- Render.specs
  launchAff_ $ runSpec [ consoleReporter ] rspecs
