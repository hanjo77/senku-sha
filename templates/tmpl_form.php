<form method="POST" enctype="multipart/form-data" id="<?= $this->table ?>Form">
	<input type="hidden" name="formName" value="<?= $this->table ?>" />
	<?
    
	foreach ($this->fields as $key=>$value) {
    	          
		$this->add_field($value);
	}

	?>
	<row class="buttons">
		<input type="button" class="button" name="exit" id="btnCancel" value="Cancel" />
		<input type="submit" class="button" name="submit" id="btnSubmit" value="OK" />		
	</row>
</form>
