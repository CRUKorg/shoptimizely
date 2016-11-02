/**
 * Created by ron on 26/02/16.
 */

(function ($, Drupal, pca) {

  Drupal.behaviors.cruk_commerce_checkout = {
    attach: function(context, settings) {
      var pca_fields = {
        'shipping': [
          {
            element: $(".customer_profile_shipping input.postal-code", context)[0],
            field: "{PostalCode}",
            mode: pca.fieldMode.SEARCH
          },
          {
            element: $(".customer_profile_shipping input.thoroughfare", context)[0],
            field: "{Line1}",
            mode: pca.fieldMode.SEARCH
          },
          {
            element: $(".customer_profile_shipping select.country", context)[0],
            field: "{CountryName}",
            mode: pca.fieldMode.COUNTRY
          }
        ],
        'billing': [
          {
            element: $(".customer_profile_billing input.postal-code", context)[0],
            field: "{PostalCode}",
            mode: pca.fieldMode.SEARCH
          },
          {
            element: $(".customer_profile_billing input.thoroughfare", context)[0],
            field: "{Line1}",
            mode: pca.fieldMode.SEARCH
          },
          {
            element: $(".customer_profile_billing select.country", context)[0],
            field: "{CountryName}",
            mode: pca.fieldMode.COUNTRY
          },
        ]
      };

      var shippingcontrol = new pca.Address(pca_fields.shipping, {
        key: settings.cruk_commerce_checkout.cruk_commerce_checkout_pca_key,
        countries: {
          defaultCode: 'GBR'
        },
        bar: {
          showCountry: false
        }
      });

      var billingcontrol = new pca.Address(pca_fields.billing, {
        key: settings.cruk_commerce_checkout.cruk_commerce_checkout_pca_key,
        countries: {
          defaultCode: 'GBR'
        },
        bar: {
          showCountry: false
        }
      });

      // Populate address fields in a given context, with given data.
      var populate_address = function (data, context) {
        if (data.Company) {
          $('input.thoroughfare', context).val(data.Company);
          $('input.premise', context).val(data.Line1);
          $('input.locality', context).val(data.Line2);
        } else {
          $('input.thoroughfare', context).val(data.Line1);
          $('input.premise', context).val(data.Line2);
          $('input.locality', context).val(data.Line3);
        }
        $('input.state', context).val(data.City);
        $('input.locality.required', context).val(data.City);
        if ($('select.state', context).length > 0) {
          $('select.state option:contains("' + data.ProvinceName + '")', context)[0].selected = true;
        }
        if (data.City == '' && data.ProvinceName != '') {
          if ($('input.state', context) != '') {
            $('input.state', context).val(data.ProvinceName);
          }
        }
        $('input.state-area', context).val(data.City);
        $('input.postal-code', context).val(data.PostalCode);
        $('.street-block label span.thoroughfare', context).text(Drupal.t('Address line 1'));
      }

      // Populate the shipping address when an address is selected from PCA.
      shippingcontrol.listen("populate", function (data) {
        populate_address(data, $('.customer_profile_shipping'));
        $('.customer_profile_shipping').find('.locality-block').show();
        $('.customer_profile_shipping .form-item-customer-profile-shipping-commerce-customer-address-und-0-premise').show();
        $('.customer_profile_shipping').find('.commerce-customer-address-manual-address').remove();
      });

      // Populate the billing address when an address is selected from PCA.
      billingcontrol.listen("populate", function (data) {
        populate_address(data, $('.customer_profile_billing'));
        $('.customer_profile_billing').find('.locality-block').show();
        $('.customer_profile_billing .form-item-customer-profile-billing-commerce-customer-address-und-0-premise').show();
        $('.customer_profile_billing').find('.commerce-customer-address-manual-address').remove();
      });

      // Allow user to manually provide address.
      $('.commerce-customer-address-manual-address').click(function(){
        $(this).siblings('.locality-block').show();
        if ($(this).parents('.customer_profile_shipping').length > 0) {
          $('.customer_profile_shipping .form-item-customer-profile-shipping-commerce-customer-address-und-0-premise').show();
          $('.customer_profile_shipping .street-block label span.thoroughfare', context).text(Drupal.t('Address line 1'));
        }
        else {
          $('.customer_profile_billing .form-item-customer-profile-billing-commerce-customer-address-und-0-premise').show();
          $('.customer_profile_billing .street-block label span.thoroughfare', context).text(Drupal.t('Address line 1'));
        }
        $(this).remove();
        return false;
      });

      shippingcontrol.load();
      billingcontrol.load();
    }
  };

})(jQuery, Drupal, pca);;
