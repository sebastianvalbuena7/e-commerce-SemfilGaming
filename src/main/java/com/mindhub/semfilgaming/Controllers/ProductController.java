package com.mindhub.semfilgaming.Controllers;

import com.mindhub.semfilgaming.DTOs.NewProductDTO;
import com.mindhub.semfilgaming.DTOs.ProductDTO;
import com.mindhub.semfilgaming.Models.*;
import com.mindhub.semfilgaming.Repositories.*;
import com.mindhub.semfilgaming.Service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ProductController {

    @Autowired
    ProductService productService;

    @Autowired
    GenreService genreService;

    @Autowired
    CategoryService categoryService;

    @Autowired
    ProductCategoryService productCategoryService;

    @Autowired
    ProductGenreService productGenreService;

    @GetMapping("/products")
    public List<ProductDTO> getAllProducts(){
        List<ProductDTO> allProducts = productService.getAllProducts().stream()
                .map(product -> new ProductDTO(product))
                .collect(Collectors.toList());
        return allProducts;
    }

    @PostMapping("/products/new")
    public ResponseEntity<Object> addProduct(@RequestBody NewProductDTO newProductDTO){


        // ----------- Verificamos que los datos no esten vacios ---------
        if(newProductDTO.getGameName().isBlank()){
            return new ResponseEntity<>("Missing game's name", HttpStatus.FORBIDDEN);
        }
        if(newProductDTO.getDesc().isBlank()){
            return new ResponseEntity<>("Missing description of the Product", HttpStatus.FORBIDDEN);
        }
        if(newProductDTO.getDesc_short().isBlank()){
            return new ResponseEntity<>("Missing short description of the Product", HttpStatus.FORBIDDEN);
        }
        if(newProductDTO.getMinimumReq().isBlank() || newProductDTO.getRecommendedReq().isBlank()){
            return new ResponseEntity<>("Missing game's requisites", HttpStatus.FORBIDDEN);
        }
        if(newProductDTO.getImageHeader().isBlank()){
            return new ResponseEntity<>("Missing game's header picture", HttpStatus.FORBIDDEN);
        }
       /* if(newProductDTO.getCategories().isEmpty()){
            return new ResponseEntity<>("Missing game's category", HttpStatus.FORBIDDEN);
        }*/
        if(newProductDTO.getGenres().isEmpty()){
            return new ResponseEntity<>("Missing game's genre", HttpStatus.FORBIDDEN);
        }

        // ------------- Verificamos los valores de precio y stock --------
        if(newProductDTO.getPrice() <= 0){
            return new ResponseEntity<>("Price can't be 0 or lesser", HttpStatus.FORBIDDEN);
        }
        if (newProductDTO.getDiscount() < 1){
            newProductDTO.setDiscount(1D);
        }
        if (newProductDTO.getStock() <=0){
            return new ResponseEntity<>("Stock can't be negative or non", HttpStatus.FORBIDDEN);
        }

        // ----------------- Creamos el nuevo producto ----------------------

        Product newProduct = new Product(
                newProductDTO.getDesc(),
                newProductDTO.getDesc_short(),
                newProductDTO.getMinimumReq(),
                newProductDTO.getRecommendedReq(),
                newProductDTO.getGameName(),
                newProductDTO.getImageHeader(),
                newProductDTO.getWebsite(),
                newProductDTO.getBackground(),
                newProductDTO.getRawBackground(),
                newProductDTO.getPrice(),
                newProductDTO.getDiscount(),
                newProductDTO.getStock(),
                0,
                newProductDTO.getScreenShoots(),
                newProductDTO.getTrailers()
        );

        productService.saveProduct(newProduct);

        // ---------- Asignamos los generos -------


        if(!newProductDTO.getGenres().isEmpty()) {
            newProductDTO.getGenres().stream().forEach(genreId -> {
                ProductGenre newTempGenres = new ProductGenre();
                Genre temp = genreService.getGenreById(genreId);
                temp.addGenre(newTempGenres);
                newProduct.addGenre(newTempGenres);
                genreService.saveGenre(temp);
                productGenreService.saveProductGenre(newTempGenres);
                productService.saveProduct(newProduct);
            });
        }

        // ---------- Asignamos las categorias ------
       /* if(!newProductDTO.getCategories().isEmpty()) {
            newProductDTO.getCategories().stream().forEach(categoryId -> {
                ProductCategory newTempCategory = new ProductCategory();
                Category temp = categoryService.findCategoryById(categoryId);
                temp.addCategories(newTempCategory);
                newProduct.addCategories(newTempCategory);
                categoryService.saveCategory(temp);
                productCategoryService.saveProductCategory(newTempCategory);
                productService.saveProduct(newProduct);
            });
        }*/

        productService.saveProduct(newProduct);
        return new ResponseEntity<>("New product added successfully", HttpStatus.CREATED);
    }

    @PatchMapping("/products/add/{Id}")
    public ResponseEntity<Object> addProductStock(Authentication authentication, @PathVariable Long Id,
                                                   @RequestParam int amount){
        Product selectedProduct = productService.getProductById(Id);
        if(selectedProduct.equals(null)){
            return new ResponseEntity<>("Product not found", HttpStatus.FORBIDDEN);
        }

        selectedProduct.setStock(selectedProduct.getStock()+amount);
        productService.saveProduct(selectedProduct);

        return new ResponseEntity<>("Stock recharged", HttpStatus.ACCEPTED);
    }


}
