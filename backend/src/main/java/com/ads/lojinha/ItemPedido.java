package com.ads.lojinha;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity
public class ItemPedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int codigoItemPedido;
    private int codigoProduto;
    private int quantidade;
    private double valor;
    /*@ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "codigoPedido", nullable = false)
    private Pedido pedido;
   */
    public int getCodigoItemPedido() {
        return codigoItemPedido;
    }
    public void setCodigoItemPedido(int codigoItemPedido) {
        this.codigoItemPedido = codigoItemPedido;
    }
    public int getCodigoProduto() {
        return codigoProduto;
    }
    public void setCodigoProduto(int codigoProduto) {
        this.codigoProduto = codigoProduto;
    }
    public int getQuantidade() {
        return quantidade;
    }
    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }
    public double getValor() {
        return valor;
    }
    public void setValor(double valor) {
        this.valor = valor;
    }
/*     public Pedido getPedido() {
        return pedido;
    }
    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }
*/
}
