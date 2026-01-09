class ApplicationController < ActionController::API
    rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found
    rescue_from ActiveRecord::RecordInvalid, with: :handle_invalid_record
    rescue_from StandardError, with: :handle_other_errors

    private

    def handle_not_found
        render json: {error: "Record not found"}, status: :not_found
    end

    def handle_invalid_record(e)
        render json: {errors: e.record.errors}, status: :unprocessable_entity
    end

    def handle_other_errors(e)
        render json: {errors: e.message}, status: :internal_server_error
    end

end
