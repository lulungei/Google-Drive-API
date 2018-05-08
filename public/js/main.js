$(document).ready(function(){
  $('.delete-detail').on('click', function(e){
    $target =$(e.target);
    const id =($target.attr('data-id'));
    $.ajax({
      type:'DELETE',
      url: '/detail/'+id,
      success: function(response){
        alert('Deleting Folder');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    })
  });
});
