package br.com.sistemaOcorrenciasUrbanas.model.entity;

import java.time.LocalDate;

public class ObraAssumidaDTO {
	
	private LocalDate dataInicio;
	private LocalDate previsao;
	private String status;
	
	public ObraAssumidaDTO(LocalDate dataInicio, LocalDate previsao, String status) {
		super();
		this.dataInicio = dataInicio;
		this.previsao = previsao;
		this.status = status;
	}

	public ObraAssumidaDTO() {
		super();
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
	
	
	

}
