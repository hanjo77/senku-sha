<row>
	<div class="formRowWrapper labelWrapper">
		<label for="<?= $id ?>"><?= $label ?></label>	
	</div>
	<div class="formRowWrapper inputWrapper">
	    <input type="<?= $type ?>" name="<?= $name ?>" id="<?= $id ?>" value="<?= $value ?>" class="textInput<?= $class ?>"<?= $misc ?> />
		<div class="validator" id="validate_<?= $id ?>"></div>	
	</div>
</row>