_validator: function (oValidator) {
			let that = this,
				oReturn = [],
				_validateEmail = function (email) {
					const re =
						/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
					return re.test(String(email).toLowerCase());
				},
				_validateAlphaNumericSpace = function (str) {
					const re = /^[a-zA-Z0-9\-\s]+$/
					return re.test(String(str));
				},
				_validateAlphaNumeric = function (str) {
					const re = /^([0-9]|[a-z])+([0-9a-z]+)$/i
					return re.test(String(str));
				};
			oValidator.forEach((v, i) => {
				let obj = that.getView().byId(v.id),
					value, rule;
				if (obj !== undefined) {
					if (v.type === "input") {
						value = obj.getValue().toString();
					}
					rule = value.trim().length;
					let aMsg = [];

					v.rule.forEach((y, j) => {
						if (y === "NotNull") {
							if (rule === 0) {
								oReturn.push({
									type: 'Error',
									group: v.fileName,
									title: v.errorRule[j],
								});
							}
						} else if (y === "Email") {
							if (!_validateEmail(value)) {
								oReturn.push({
									type: 'Error',
									group: v.fileName,
									title: v.errorRule[j],
								});
							}
						} else if (y === "AlphaNumeric") {
							if (!_validateAlphaNumeric(value)) {
								oReturn.push({
									type: 'Error',
									group: v.fileName,
									title: v.errorRule[j],
								});
							}
						} else if (y === "AlphaNumericSpace") {
							if (!_validateAlphaNumericSpace(value)) {
								oReturn.push({
									type: 'Error',
									group: v.fileName,
									title: v.errorRule[j],
								});
							}
						}
					})

					if (v.mamLength !== undefined) {
						if (!(rule >= v.mamLength[0] && rule <= v.mamLength[1])) {
							oReturn.push({
								type: 'Error',
								group: v.fileName,
								title: v.errorMamLength,
							});
						}
					}
					if (v.maxLength !== undefined) {
						if (rule >= v.maxLength) {
							oReturn.push({
								type: 'Error',
								group: v.fileName,
								title: v.errorMaxLength,
							});
						}
					}
					if (v.minLength !== undefined) {
						if (rule <= v.minLength) {
							oReturn.push({
								type: 'Error',
								group: v.fileName,
								title: v.errorMinLength,
							});
						}
					}
				}
			});
			return oReturn;
		},
		/**
		 * Error Message Build fro Validator
		 * Help Method
		 */
		_buildErorMsg: function (oData) {
			let oMessageTemplate = new sap.m.MessageItem({
				type: '{type}',
				title: '{title}',
				subtitle: '{subtitle}',
				groupName: '{group}'
			});

			let oModel = new sap.ui.model.json.JSONModel();

			oModel.setData(oData);

			let oMessageView = new sap.m.MessageView({
				showDetailsPageHeader: false,
				itemSelect: function () {
					oBackButton.setVisible(true);
				},
				items: {
					path: "/",
					template: oMessageTemplate
				},
				groupItems: true
			});

			let oBackButton = new sap.m.Button({
				icon: sap.ui.core.IconPool.getIconURI("nav-back"),
				visible: false,
				press: function () {
					oMessageView.navigateBack();
					this.setVisible(false);
				}
			});

			oMessageView.setModel(oModel);

			let oDialog = new sap.m.Dialog({
				resizable: true,
				content: oMessageView,
				state: 'Error',
				beginButton: new sap.m.Button({
					press: function () {
						this.getParent().close();
					},
					text: "Close"
				}),
				customHeader: new sap.m.Bar({
					contentMiddle: [
						new sap.m.Text({
							text: "Error"
						})
					],
					contentLeft: [oBackButton]
				}),
				contentHeight: "50%",
				contentWidth: "50%",
				verticalScrolling: false
			});
			oDialog.open();
		}
