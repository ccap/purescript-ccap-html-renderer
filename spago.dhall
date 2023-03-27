{ name = "purescript-ccap-html-renderer"
, dependencies =
  [ "aff"
  , "bifunctors"
  , "console"
  , "effect"
  , "either"
  , "exceptions"
  , "halogen"
  , "halogen-vdom-string-renderer"
  , "media-types"
  , "newtype"
  , "node-buffer"
  , "node-fs"
  , "node-path"
  , "node-process"
  , "prelude"
  , "spec"
  , "transformers"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}
