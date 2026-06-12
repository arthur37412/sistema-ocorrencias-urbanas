package br.com.sistemaOcorrenciasUrbanas.controller.web;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import br.com.sistemaOcorrenciasUrbanas.model.entity.ObraAssumidaDTO;
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
	 if("Obra".equals(registro.getTipoRegistro())){
	        registro.setIdResponsavel(usuario.getIdUsuario());
	        registro.setNomeResponsavel(usuario.getNomeUsuario());
	    }
	 return registroService.saveRegistro(registro);
	 }
	 
	 
	 @PutMapping("api/registros/assumir/{idRegistro}")
	 @ResponseBody
	 public Registro assumirRegistroComoObra(@PathVariable int idRegistro, @RequestBody ObraAssumidaDTO dadosAssumir, HttpSession session) {

	 Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
	 if(usuario == null){
	    throw new RuntimeException("É necessário estar logado.");
	     }
	 if(!"Gestor".equals(usuario.getTipoUsuario()) &&
	    !"Administrador".equals(usuario.getTipoUsuario())){
	    throw new RuntimeException("Apenas gestores podem assumir registros.");
	 }
	 Registro registro = registroService.buscarPorIdRegistro(idRegistro);
	 if(!"Registro".equals(registro.getTipoRegistro())){
	    throw new RuntimeException("Apenas registros podem ser assumidos como obra.");
	 }
	 registro.setTipoRegistro("Obra");
	 registro.setIdResponsavel(usuario.getIdUsuario());
	 registro.setNomeResponsavel(usuario.getNomeUsuario());
	 registro.setDataInicio(dadosAssumir.getDataInicio());
	 registro.setPrevisao(dadosAssumir.getPrevisao());
	 registro.setStatus(dadosAssumir.getStatus());
	 
	 return registroService.saveRegistro(registro);
	 }
	 
	 //qualquer um pode alterar
	 @PutMapping("api/registros/{idRegistro}")
	 @ResponseBody
	 public Registro editarRegistro(@PathVariable int idRegistro, @RequestBody Registro dadosAtualizados, HttpSession session) {
	 Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");

	 if (usuario == null) {
	     throw new RuntimeException("É necessário estar logado.");
	     }

	 Registro registro = registroService.buscarPorIdRegistro(idRegistro);
	 boolean usuarioComumEditandoRegistroLivre = "Usuario".equals(usuario.getTipoUsuario()) && "Registro".equals(registro.getTipoRegistro()) && registro.getIdResponsavel() == null;
	 boolean gestorEditandoPropriaObra = "Gestor".equals(usuario.getTipoUsuario()) && "Obra".equals(registro.getTipoRegistro()) && registro.getIdResponsavel() != null && registro.getIdResponsavel().equals(usuario.getIdUsuario());
	 boolean adminEditando = "Administrador".equals(usuario.getTipoUsuario());
     if (!usuarioComumEditandoRegistroLivre && !gestorEditandoPropriaObra && !adminEditando) {
	     throw new RuntimeException("Você não tem permissão para editar este registro.");
	     }

	 registro.setTitulo(dadosAtualizados.getTitulo());
	 registro.setDescricao(dadosAtualizados.getDescricao());
	 registro.setTipoLocal(dadosAtualizados.getTipoLocal());
	 registro.setTrafegoV(dadosAtualizados.getTrafegoV());
	 registro.setTrafegoP(dadosAtualizados.getTrafegoP());
	 registro.setFuncionamento(dadosAtualizados.getFuncionamento());
	 registro.setRuidoExcessivo(dadosAtualizados.isRuidoExcessivo());
	 registro.setPoeiraExcessiva(dadosAtualizados.isPoeiraExcessiva());
	 registro.setEntulho(dadosAtualizados.isEntulho());

	 if("Obra".equals(registro.getTipoRegistro())) {
	      registro.setDataInicio(dadosAtualizados.getDataInicio());
	      registro.setPrevisao(dadosAtualizados.getPrevisao());
	      registro.setStatus(dadosAtualizados.getStatus());
	     }

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
	     return "redirect:/";
	 }
	 
	 
	 @GetMapping("/cadastro")
	 public String cadastro() {
		 return "cadastro";
	 }
	 
	// login vindo do cadastro
	    @PostMapping("/cadastro")
	    public String cadastrarUsuario(Usuario usuario, RedirectAttributes redirectAttributes) {
	    	Usuario usuarioExistente = usuarioService.buscarPorEmail(usuario.getEmailUsuario());
	    	if(usuarioExistente != null){
	    	redirectAttributes.addFlashAttribute("erroCadastro", "Este email já foi cadastrado.");
	    	return "redirect:/cadastro";
	    	    }
	    	
	    	// Adapta o objeto do html para o bd
	    	String tipo = usuario.getTipoUsuario();
	        if(tipo.equals("Cidadao")){
	            usuario.setTipoUsuario("Usuario");
	        }
	        else if(tipo.equals("Prestador de Servico")){
	            usuario.setTipoUsuario("Gestor");
	        }
	        
	        usuarioService.saveUsuario(usuario);
	        redirectAttributes.addFlashAttribute("sucesso", "Cadastro realizado com sucesso!");
	        return "redirect:/login";
	    }
	    
	    @GetMapping("/perfil")
	    public String perfil(HttpSession session, Model model) {
	        Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
	        if (usuario == null) {
	            return "redirect:/login";
	        }
	        model.addAttribute("usuario", usuario);
	        if ("Usuario".equals(usuario.getTipoUsuario())) {
	            model.addAttribute("registros", registroService.buscarPorCriador(usuario.getIdUsuario()));
	            model.addAttribute("tituloLista", "Minhas Ocorrências");
	        }
	        else {
	            model.addAttribute("registros", registroService.buscarPorResponsavel(usuario.getIdUsuario()));
	            model.addAttribute("tituloLista", "Minhas Obras");
	        }
	        return "perfil";
	    }
	    
	    @PostMapping("/perfil/editar")
	    public String editarPerfil( Usuario dadosUsuario, HttpSession session) {
	        Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
	        if (usuario == null) {
	            return "redirect:/login";
	        }
	        usuario.setNomeUsuario(dadosUsuario.getNomeUsuario());
	        usuario.setEmailUsuario(dadosUsuario.getEmailUsuario());
	        usuarioService.saveUsuario(usuario);
	        session.setAttribute("usuarioLogado", usuario);

	        return "redirect:/perfil";
	    }
	    
	    @PutMapping("api/registros/concluir/{idRegistro}")
	    @ResponseBody
	    public Registro concluirRegistro(@PathVariable int idRegistro, HttpSession session) {
	        Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
	        if (usuario == null) {
	            throw new RuntimeException("É necessário estar logado.");
	        }
	        Registro registro = registroService.buscarPorIdRegistro(idRegistro);
	        boolean registroLivre = "Registro".equals(registro.getTipoRegistro());
	        boolean responsavelObra = "Obra".equals(registro.getTipoRegistro()) && registro.getIdResponsavel() != null && registro.getIdResponsavel().equals(usuario.getIdUsuario());
	        boolean admin = "Administrador".equals(usuario.getTipoUsuario());
	        if (!registroLivre && !responsavelObra && !admin) {
	            throw new RuntimeException("Você não tem permissão para concluir.");
	        }
	        if ("Registro".equals(registro.getTipoRegistro())) {
	            registro.setStatus("Resolvido");
	        } else {
	            registro.setStatus("Concluído");
	        }
	        registro.setDataConclusao(LocalDate.now());

	        return registroService.saveRegistro(registro);
	    }
	    
	    @PutMapping("api/registros/reabrir/{idRegistro}")
	    @ResponseBody
	    public Registro reabrirRegistro(@PathVariable int idRegistro, HttpSession session) {
	    Usuario usuario = (Usuario) session.getAttribute("usuarioLogado");
	    if (usuario == null) {
	        throw new RuntimeException("É necessário estar logado.");
	        }
	    Registro registro = registroService.buscarPorIdRegistro(idRegistro);
	    boolean registroLivre = "Registro".equals(registro.getTipoRegistro());
	    boolean responsavelObra = "Obra".equals(registro.getTipoRegistro()) && registro.getIdResponsavel() != null && registro.getIdResponsavel().equals(usuario.getIdUsuario());
	    boolean admin = "Administrador".equals(usuario.getTipoUsuario());
	    if (!registroLivre && !responsavelObra && !admin) {
	        throw new RuntimeException("Você não tem permissão para reabrir.");
	        }
	    if ("Registro".equals(registro.getTipoRegistro())) {
	         registro.setStatus("Pendente");
	        } else {
	           registro.setStatus("Em andamento");
	        }
	    registro.setDataConclusao(null);

	    return registroService.saveRegistro(registro);
	    }
	    
	   
	    
}
