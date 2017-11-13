const meu_id = 0;


export default class MeuId {
	static getId() {
		return meu_id;	
	}

	static setId(id) {
		meu_id = id;
	}

}
