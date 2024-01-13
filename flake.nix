{
  description = "mkdocs";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-23.11";
  };

  outputs = { self , nixpkgs ,... }:
  let
    system = "x86_64-linux";
  in {
    devShells."${system}".default =
    let
      pkgs = import nixpkgs {
        inherit system;
      };
    in pkgs.mkShell {
      #LD_LIBRARY_PATH = "${pkgs.stdenv.cc.cc.lib}/lib";
      packages = with pkgs; [
        python311Packages.mkdocs-material
        python311Packages.ipykernel
        python311Packages.nbconvert
        python311Packages.traitlets
        python311Packages.jupytext
        python311Packages.pandas
        python311Packages.python-markdown-math
        python311Packages.mkdocs-simple-hooks
        python311Packages.pillow
        python311Packages.cairosvg
        python311Packages.matplotlib
        python311Packages.scipy
        python311Packages.plotly
        python311Packages.ipywidgets
      ];
    };
  };
}
