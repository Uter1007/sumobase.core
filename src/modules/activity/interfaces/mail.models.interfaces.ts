export interface IRawMailDataModel {
    to:         string;
    subject:    string;
    template:   string;
    data:       any;
}

export interface IMailResponse {
    id:         string;
    message:    string;
}
