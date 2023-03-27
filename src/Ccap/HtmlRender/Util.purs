module Ccap.HtmlRender.Util
  ( liftEffectSafely
  , processResult
  ) where

import Prelude
import Control.Monad.Error.Class (try)
import Control.Monad.Except (ExceptT(..), runExceptT)
import Data.Bifunctor (lmap)
import Data.Either (either)
import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Class (liftEffect)
import Effect.Class.Console as Console
import Effect.Exception as Exception
import Node.Process as Process

liftEffectSafely :: forall a. Effect a -> ExceptT String Aff a
liftEffectSafely = ExceptT <<< liftEffect <<< map (lmap Exception.message) <<< try

processResult :: ExceptT String Aff Unit -> Aff Unit
processResult r = do
  e <- runExceptT r
  e
    # either
        ( \s ->
            liftEffect
              $ do
                  Console.error $ "ERROR: " <> s
                  Process.exit 1
        )
        pure
