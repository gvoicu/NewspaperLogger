$(function(){
    cc = {}

    $("#close_app").click(function(){
      window.open('', '_self', '');
      window.close();
    });

    $("#clear_list").click(function(){
      window.location.reload();
    });


    $(".select-checkbox").change(function(){

      hash_key    = $(this).data("check-id");
      price       = parseInt($(this).data("price"));
      addon_price = parseInt($(this).data("addon-price"));

      if(this.checked == true){
        // A adaugat comanda
        cc[hash_key] = [1, 0];

        if($(this).data("addon") == "1"){
          adauga_addon = confirm("Adauga addon?");
          if(adauga_addon == true){
            // Adauga addon
            cc[hash_key] = [1, 1];
          }
        }

        $("#total_sum").html(parseInt($("#total_sum").html(),10) + cc[hash_key][0] * price + cc[hash_key][1] * addon_price );

      } else {
        // A sters comanda
        $("#total_sum").html(parseInt($("#total_sum").html(),10) - cc[hash_key][0] * price - cc[hash_key][1] * addon_price );
        cc[hash_key] = null;
      }
    });

    $("#fin_command").click(function(){
      jQuery.ajax({
        url: "/fin_command",
        type: "POST",
        data: JSON.stringify(cc),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(result) {
        //Write your code here
          window.location.reload();
            /*alert("success");*/
         },
        failure: function(errMsg) {
        }
      });
    });
});
