package br.com.sistemaOcorrenciasUrbanas.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class IndexWebController {

	 public String index() {
	        return "index";
	    }
	 
	 @GetMapping("/registro")
	 public String login() {
	        return "login";
	 }
}
