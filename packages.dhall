let upstream =
      https://github.com/purescript/package-sets/releases/download/psc-0.15.7-20230322/packages.dhall
        sha256:384d2a2879dff96ef51bf68110bfc76ce1c18a6481adec9f03f19d1739f933db


let additions =
      { halogen-vdom-string-renderer = 
        { dependencies =
          [ "arrays"
          , "assert"
          , "effect"
          , "foreign"
          , "halogen-vdom"
          , "maybe"
          , "ordered-collections"
          , "prelude"
          , "strings"
          , "tuples"
          , "unsafe-coerce"
          ]
        , repo = "https://github.com/ccap/purescript-halogen-vdom-string-renderer.git"
        , version = "e557ab6fadf6323b7a0a3873fc02f6220da03b6a"
        }
      }

in upstream ⫽ additions
