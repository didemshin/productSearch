var cartList = new Array();
var productList = new Array();
var cartCount = 0;

var customJquery = {
    JSONService: function () {
        $.getJSON("https://mocki.io/v1/77e2d3e3-84cd-465e-9368-c42372e4ebf6", function (data) {
            $.each(data, function (index, item) {
                customJquery.addWidget(item, "#product-list");
                productList.push(item);
            });
        });
    },

    addWidget: function (item, elementID) {
        $(elementID).append('<div class="col-lg-4 col-md-6 col-sm-12 mb-5 cart-item" data-id="'+ item.id +'" data-category="'+ item.category +'">' +
                '<div class="card border-0 shadow">' +
                        '<div class="product-image"><img class="card-img-bottom" src="'+ item.image +'" alt="Card image" style="width:100%"></div>' +
                        '<div class="card-body">' +
                            '<div class="product-name">'+ item.title +'</div>' +
                            '<div class="product-price">'+ item.price +'₺</div>' +
                            '<div class="myCardIcon">Add to Card</div>' +
                        '</div>'+
                    '</div>' +
                '</div>' +
            '</div>');
    },

    filterSearch: {
        searchClickEvent: function () {
            $(".list-group .list-group-item").click(function () {
                customJquery.searchResult.searchReset();
                var searchValue = $(this).data("category");
                if (searchValue == 'all' ) {
                    customJquery.filterSearch.filterReset();
                } else {
                    $('.cart-list').addClass('filter-active');
                    $('.cart-list .cart-item').removeClass('selected');
                    $('.cart-list .cart-item[data-category="' + searchValue + '"]').addClass('selected');
                }
            });
        },
        filterReset: function (){
            $( '.cart-list').removeClass('filter-active');
            $( '.cart-list .cart-item').removeClass( 'selected');
        }
    },

    cartFunction:{
        addCart:function (){
            $(document).on("click", ".myCardIcon", function () {
                var selectProduct = $(this).parents(".cart-item").data("id");
                $.each(productList, function (index, item) {
                    if(item.id == selectProduct){
                        cartList.push(item);
                        cartCount ++;
                    }
                });
                $(".sepetUrunSayisi").text(cartCount);
                customJquery.cartFunction.cartListShow();
            });
        },

        removeCart:function (){
            $(document).on("click", ".mini-cart-list .mini-cart-box .removeIcon", function () {
                var selectProduct = $(this).parents(".mini-cart-box").data("id");
                $.each(cartList, function (index, item) {
                    if(item.id == selectProduct){
                        var indexValue = cartList.indexOf(item);
                        if (indexValue != -1){
                            cartList.splice(indexValue, 1);
                            cartCount --;
                            return false;
                        }
                    }
                });
                customJquery.cartFunction.cartListShow();
                $(".sepetUrunSayisi").text(cartCount);
            });
        },

        cartListShow:function (){
            $(".mini-cart-list .mini-cart-box").remove();
            if(cartList.length > 0){
                $(".divustSepetteUrunYok").css("display","none");
                $.each(cartList, function (index, item) {
                    $(".mini-cart-list").append("<div class='mini-cart-box' data-id='"+ item.id +"'>" +
                        "<div class='mini-cart-img'>" +
                            "<img src='"+ item.image +"'>" +
                        "</div>" +
                        "<div class='leftArea'>" +
                            "<div class='mini-cart-name'>"+ item.title +"</div>" +
                            "<div class='mini-cart-price'>"+ item.price +"</div>" +
                        "</div>" +
                        "<div class='removeIcon'>" +
                            "<svg viewBox='0 0 371.23 371.23'>" +
                                "<polygon points='371.23,21.213 350.018,0 185.615,164.402 21.213,0 0,21.213 164.402,185.615 0,350.018 21.213,371.23 185.615,206.828 350.018,371.23 371.23,350.018 206.828,185.615'></polygon>" +
                            "</svg>" +
                        "</div>" +
                        "</div>");
                });
            }if(cartList.length <= 0){
                $(".divustSepetteUrunYok").css("display","block");
            }

        },

        openCart:function (){
            $(".my-card").click(function (){
                $('.CartProduct').addClass('active');
                customJquery.cartFunction.cartListShow();
            });
        },

        closeCart:function (){
            $(".CartProduct .closeIcon").click(function (){
                $('.CartProduct').removeClass('active');
            });
        }
    },

    searchResult: {
        searchKeyupEvent: function () {
            $('.searchInput').on("keyup", function() {
                customJquery.filterSearch.filterReset();
                var searchVal = $(this).val();
                if (searchVal != "") {
                    $(".cart-list .cart-item").filter(function() {
                        $(this).toggle($(this).text().toLowerCase().indexOf(searchVal) > -1)
                    });
                }if (searchVal == "") {
                    customJquery.searchResult.searchReset();
                }
            });
        },
        searchReset:function (){
            $(".cart-item").removeAttr('style');
        }
    },
};

$(document).ready(function () {
    with (customJquery) {
        JSONService();

        filterSearch.searchClickEvent();

        searchResult.searchKeyupEvent();

        with (cartFunction) {
            openCart();
            closeCart();
            addCart();
            removeCart();
            cartListShow();
        }
    }
});