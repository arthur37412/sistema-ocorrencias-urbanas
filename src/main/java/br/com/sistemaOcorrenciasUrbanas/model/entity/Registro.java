package br.com.sistemaOcorrenciasUrbanas.model.entity;

import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;


@Entity
@Table(name = "Registros")
public class Registro {
	
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private int idRegistro;
	private String titulo;
	private String descricao;
	private String tipoRegistro;
	private Integer idCriador;
	@CreationTimestamp
	private LocalDate dataRegistro;
	private Double latitude;
	private Double longitude;
	private String tipoLocal;

	// obras assumidas
	private Integer idResponsavel;
	private LocalDate dataInicio;
	private LocalDate previsao;
	private String status;
	
	//consequencias dos registros
	private String trafegoV;
	private String trafegoP;
	private String funcionamento;
	private Boolean ruidoExcessivo;
	private Boolean poeiraExcessiva;
	private Boolean entulho;
	
	//construtor
		public Registro() {}
	
	public Registro(int idRegistro, String titulo, String descricao, String tipoRegistro, Integer idCriador,
			LocalDate dataRegistro, Double latitude, Double longitude, String tipoLocal, Integer idResponsavel, LocalDate dataInicio, LocalDate previsao, String status,
			String trafegoV, String trafegoP, String funcionamento, Boolean ruidoExcessivo,
			Boolean poeiraExcessiva, Boolean entulho) {
		super();
		this.idRegistro = idRegistro;
		this.titulo = titulo;
		this.descricao = descricao;
		this.tipoRegistro = tipoRegistro;
		this.idCriador = idCriador;
		this.dataRegistro = dataRegistro;
		this.latitude = latitude;
		this.longitude = longitude;
		this.tipoLocal = tipoLocal;
		this.idResponsavel = idResponsavel;
		this.dataInicio = dataInicio;
		this.previsao = previsao;
		this.status = status;
		this.trafegoV = trafegoV;
		this.trafegoP = trafegoP;
		this.funcionamento = funcionamento;
		this.ruidoExcessivo = ruidoExcessivo;
		this.poeiraExcessiva = poeiraExcessiva;
		this.entulho = entulho;
	}
	
	//gtters e setters

	public int getIdRegistro() {
		return idRegistro;
	}

	public void setIdRegistro(int idRegistro) {
		this.idRegistro = idRegistro;
	}

	public String getTitulo() {
		return titulo;
	}

	public void setTitulo(String titulo) {
		this.titulo = titulo;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public String getTipoRegistro() {
		return tipoRegistro;
	}

	public void setTipoRegistro(String tipoRegistro) {
		this.tipoRegistro = tipoRegistro;
	}

	public Integer getIdCriador() {
		return idCriador;
	}

	public void setIdCriador(Integer idCriador) {
		this.idCriador = idCriador;
	}

	public LocalDate getDataRegistro() {
		return dataRegistro;
	}

	public void setDataRegistro(LocalDate dataRegistro) {
		this.dataRegistro = dataRegistro;
	}

	public Integer getIdResponsavel() {
		return idResponsavel;
	}

	public void setIdResponsavel(Integer idResponsavel) {
		this.idResponsavel = idResponsavel;
	}

	public LocalDate getDataInicio() {
		return dataInicio;
	}

	public void setDataInicio(LocalDate dataInicio) {
		this.dataInicio = dataInicio;
	}

	public LocalDate getPrevisao() {
		return previsao;
	}

	public void setPrevisao(LocalDate previsao) {
		this.previsao = previsao;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getTrafegoV() {
		return trafegoV;
	}

	public void setTrafegoV(String trafegoV) {
		this.trafegoV = trafegoV;
	}

	public String getTrafegoP() {
		return trafegoP;
	}

	public void setTrafegoP(String trafegoP) {
		this.trafegoP = trafegoP;
	}

	public String getFuncionamento() {
		return funcionamento;
	}

	public void setFuncionamento(String funcionamento) {
		this.funcionamento = funcionamento;
	}

	public Boolean isRuidoExcessivo() {
		return ruidoExcessivo;
	}

	public void setRuidoExcessivo(Boolean ruidoExcessivo) {
		this.ruidoExcessivo = ruidoExcessivo;
	}

	public Boolean isPoeiraExcessiva() {
		return poeiraExcessiva;
	}

	public void setPoeiraExcessiva(Boolean poeiraExcessiva) {
		this.poeiraExcessiva = poeiraExcessiva;
	}

	public Boolean isEntulho() {
		return entulho;
	}

	public void setEntulho(Boolean entulho) {
		this.entulho = entulho;
	}
	
	public Double getLatitude() {
		return latitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	public Double getLongitude() {
		return longitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	public String getTipoLocal() {
		return tipoLocal;
	}

	public void setTipoLocal(String tipoLocal) {
		this.tipoLocal = tipoLocal;
	}
	
	
}
