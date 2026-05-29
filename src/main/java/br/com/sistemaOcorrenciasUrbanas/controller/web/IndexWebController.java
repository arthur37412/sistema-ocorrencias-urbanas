package br.com.sistemaOcorrenciasUrbanas.controller.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import br.com.sistemaOcorrenciasUrbanas.model.entity.Registro;
import br.com.sistemaOcorrenciasUrbanas.model.entity.Usuario;
import br.com.sistemaOcorrenciasUrbanas.service.RegistroService;
import br.com.sistemaOcorrenciasUrbanas.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/")
public class IndexWebController {
	
	 @Autowired
	 private UsuarioService usuarioService;
	 
	 @Autowired
	 private RegistroService registroService;

	 public String index() {
	        return "index";
	    }
	 
	 @GetMapping("/")
		public String index(HttpSession session, Model model) {
			Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
			model.addAttribute("usuario", usuario);
			return "index";
		}
	 
	 //Criar registros
	 @PostMapping("api/registros")
	 @ResponseBody
	 public Registro insert(@RequestBody Registro registro, HttpSession session) {
	 Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
	 if(usuario == null){
		throw new RuntimeException("É necessário entrar em sua conta para criar um registro");
		}
	 registro.setIdCriador(usuario.getIdUsuario());
	 return registroService.saveRegistro(registro);
	 }
	 
	 
	 @GetMapping("/login")
	 public String login() {
	        return "login";
	 }
	 
	 @PostMapping("/login")
	 public String loginUsuario(String emailUsuario, String senhaUsuario, RedirectAttributes redirectAttributes, HttpSession session) {
     Usuario usuario = usuarioService.fazerLogin(emailUsuario, senhaUsuario);
         if(usuario == null){redirectAttributes.addFlashAttribute("erroLogin", "Email ou senha inválidos.");
	     return "redirect:/login";
		 }
      // salva usuário logado
         session.setAttribute("usuarioLogado", usuario);
		    return "redirect:/";
	 }
	 
	 
	 @GetMapping("/sair")
	 public String sair(HttpSession session, HttpServletRequest request) {
	     session.invalidate();
	     String paginaAnterior = request.getHeader("Referer");
	     if(paginaAnterior == null){
	         return "redirect:/";
	     }
	     return "redirect:" + paginaAnterior;
	 }
	 
	 
	 @GetMapping("/cadastro")
	 public String cadastro() {
		 return "cadastro";
	 }
	 
	// login vindo do cadstro
	    @PostMapping("/cadastro")
	    public String cadastrarUsuario(Usuario usuario, RedirectAttributes redirectAttributes) {
	    	Usuario usuarioExistente = usuarioService.buscarPorEmail(usuario.getEmailUsuario());
	    	if(usuarioExistente != null){
	    	redirectAttributes.addFlashAttribute("erroCadastro", "Este email já foi cadastrado.");
	    	return "redirect:/cadastro";
	    	    }
	        usuarioService.saveUsuario(usuario);
	        redirectAttributes.addFlashAttribute("sucesso", "Cadastro realizado com sucesso!");
	        return "redirect:/login";
	    }
	    
	    
	    
	    
}
